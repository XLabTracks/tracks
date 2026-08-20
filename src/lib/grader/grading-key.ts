import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { decryptApiKey } from "./key-crypto";
import {
  getOpenRouterKeyStatus,
  keyAad,
  keyStorageSecret,
  type OpenRouterKeyStatus,
} from "./user-key";
import type { GraderKeySource } from "./classify";

// Which OpenRouter key the grader bills. A learner can hold several at once
// (their own key plus one per classroom whose instructor stored one); this
// module assembles the available sources and resolves which one a grading
// call uses. Decrypted key material stays inside the grading action — the
// client only ever sees classroom names, states, and last4s.

const PROVIDER = "openrouter";

/** AES-GCM additionalData binding a classroom ciphertext to its owning row.
 * The "classroom:" prefix keeps the namespace disjoint from user-key AADs. */
export function classroomKeyAad(classroomId: string): string {
  return `classroom:${classroomId}:${PROVIDER}`;
}

/** A grader key choice: the server-wide key, the user's own, or a classroom's. */
export type GraderKeySelection = "server" | "user" | `classroom:${string}`;

export function isGraderKeySelection(
  value: string,
): value is GraderKeySelection {
  return (
    value === "server" || value === "user" || value.startsWith("classroom:")
  );
}

export function classroomIdOfSelection(
  selection: GraderKeySelection,
): string | null {
  return selection.startsWith("classroom:")
    ? selection.slice("classroom:".length)
    : null;
}

export interface ClassroomKeyOption {
  classroomId: string;
  classroomName: string;
  last4: string;
  /** false when the stored row no longer decrypts (rotated secret). */
  usable: boolean;
}

export interface GraderKeyView {
  personal: OpenRouterKeyStatus;
  /** Classroom keys available to this user, in join order. */
  classrooms: ClassroomKeyOption[];
  /** What grading will use right now (stored preference, else automatic). */
  selected: GraderKeySelection;
}

/**
 * Resolves the effective key selection. The stored preference wins while it
 * still points at an available source; otherwise automatic: the user's own
 * key if one is stored (even needs-reentry — erroring there is deliberate,
 * never a silent fallback), else a sole available classroom key, else the
 * server-wide key. With several classroom keys and no preference the server
 * key is used — auto-picking one instructor's key to bill would be arbitrary;
 * the dropdown exists exactly so the learner chooses.
 */
export function resolveGraderKeySelection(
  pref: string | null,
  personalState: OpenRouterKeyStatus["state"],
  classroomIds: string[],
  usableClassroomIds: string[] = classroomIds,
): GraderKeySelection {
  if (pref === "server") return "server";
  if (pref === "user" && personalState !== "none") return "user";
  if (pref != null) {
    // An explicit classroom preference is honored as long as the user still
    // belongs to that classroom, even if its key is currently undecryptable —
    // grading then surfaces the precise "re-enter it" error rather than
    // silently billing elsewhere.
    const id = classroomIdOfSelection(pref as GraderKeySelection);
    if (id != null && classroomIds.includes(id)) {
      return `classroom:${id}`;
    }
  }
  if (personalState !== "none") return "user";
  // Automatic fallback only ever picks a *usable* classroom key — an
  // undecryptable one the learner never explicitly chose must not strand them
  // on an un-gradeable selection; fall through to the server key instead.
  if (usableClassroomIds.length === 1) return `classroom:${usableClassroomIds[0]}`;
  return "server";
}

/**
 * Every grader key source available to the user plus the effective selection,
 * or null when key storage is unconfigured (the whole key UI is hidden).
 * Probes decryption on each row so the UI never offers a key grading cannot
 * read. cache()-wrapped so the many <Exercise/> instances on one lesson page
 * share a single lookup.
 */
export const getGraderKeyView = cache(
  async (userId: string): Promise<GraderKeyView | null> => {
    const secret = keyStorageSecret();
    if (!secret) return null;
    const [personal, user, memberships] = await Promise.all([
      getOpenRouterKeyStatus(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: { graderKeyPref: true },
      }),
      prisma.classroomMembership.findMany({
        where: {
          userId,
          classroom: { apiKeys: { some: { provider: PROVIDER } } },
        },
        select: {
          classroom: {
            select: {
              id: true,
              name: true,
              apiKeys: {
                where: { provider: PROVIDER },
                select: { ciphertext: true, last4: true },
              },
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      }),
    ]);
    const classrooms = (
      await Promise.all(
        memberships.map(async ({ classroom }) => {
          const row = classroom.apiKeys[0];
          if (!row) return null;
          const decrypted = await decryptApiKey(
            row.ciphertext,
            secret,
            classroomKeyAad(classroom.id),
          );
          return {
            classroomId: classroom.id,
            classroomName: classroom.name,
            last4: row.last4,
            usable: decrypted != null,
          } satisfies ClassroomKeyOption;
        }),
      )
    ).filter((option): option is ClassroomKeyOption => option != null);
    // personal is non-null here: getOpenRouterKeyStatus only returns null
    // when key storage is unconfigured, which the secret gate above excludes.
    const personalStatus = personal ?? { state: "none" as const, last4: null };
    return {
      personal: personalStatus,
      classrooms,
      selected: resolveGraderKeySelection(
        user?.graderKeyPref ?? null,
        personalStatus.state,
        classrooms.map((c) => c.classroomId),
        classrooms.filter((c) => c.usable).map((c) => c.classroomId),
      ),
    };
  },
);

export type ResolvedGraderKey =
  | {
      ok: true;
      keySource: GraderKeySource;
      classroomId?: string;
      /** Null only for the server-wide source, supplied by the action. */
      apiKey: string | null;
    }
  | { ok: false; error: string };

/**
 * Backend-only resolver for a grading request. Unlike getGraderKeyView, this
 * returns the selected plaintext key and therefore must never cross a server
 * boundary. One relational query replaces the old view query plus a second
 * selected-key query; decryption probes run concurrently.
 */
export async function resolveGraderKeyForRequest(
  userId: string,
): Promise<ResolvedGraderKey> {
  const secret = keyStorageSecret();
  if (!secret) return { ok: true, keySource: "server", apiKey: null };
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      graderKeyPref: true,
      apiKeys: {
        where: { provider: PROVIDER },
        select: { ciphertext: true },
      },
      memberships: {
        where: { classroom: { apiKeys: { some: { provider: PROVIDER } } } },
        orderBy: { joinedAt: "asc" },
        select: {
          classroom: {
            select: {
              id: true,
              apiKeys: {
                where: { provider: PROVIDER },
                select: { ciphertext: true },
              },
            },
          },
        },
      },
    },
  });
  if (!user) return { ok: true, keySource: "server", apiKey: null };

  const personalCiphertext = user.apiKeys[0]?.ciphertext;
  const personalKey = personalCiphertext
    ? await decryptApiKey(personalCiphertext, secret, keyAad(userId))
    : null;
  const classrooms = await Promise.all(
    user.memberships.map(async ({ classroom }) => {
      const ciphertext = classroom.apiKeys[0]?.ciphertext;
      return {
        id: classroom.id,
        key: ciphertext
          ? await decryptApiKey(
              ciphertext,
              secret,
              classroomKeyAad(classroom.id),
            )
          : null,
      };
    }),
  );
  const selection = resolveGraderKeySelection(
    user.graderKeyPref,
    personalCiphertext ? (personalKey ? "active" : "needs-reentry") : "none",
    classrooms.map((classroom) => classroom.id),
    classrooms.filter((classroom) => classroom.key).map((classroom) => classroom.id),
  );
  if (selection === "user") {
    return personalKey
      ? { ok: true, keySource: "user", apiKey: personalKey }
      : {
          ok: false,
          error:
            "Your stored OpenRouter key can no longer be read — replace or remove it below, then try again.",
        };
  }
  const classroomId = classroomIdOfSelection(selection);
  if (classroomId != null) {
    const key = classrooms.find((classroom) => classroom.id === classroomId)?.key;
    return key
      ? { ok: true, keySource: "classroom", classroomId, apiKey: key }
      : {
          ok: false,
          error:
            "The selected classroom's grading key can no longer be used — pick another key below, or ask the instructor to re-enter it.",
        };
  }
  return { ok: true, keySource: "server", apiKey: null };
}

/**
 * Display status of a classroom's stored key for the instructor UI, or null
 * when key storage is unconfigured. Membership/role checks are the caller's
 * job — this returns nothing beyond state + last4 either way.
 */
export async function getClassroomKeyStatus(
  classroomId: string,
): Promise<OpenRouterKeyStatus | null> {
  const secret = keyStorageSecret();
  if (!secret) return null;
  const row = await prisma.classroomApiKey.findUnique({
    where: { classroomId_provider: { classroomId, provider: PROVIDER } },
    select: { ciphertext: true, last4: true },
  });
  if (!row) return { state: "none", last4: null };
  const decrypted = await decryptApiKey(
    row.ciphertext,
    secret,
    classroomKeyAad(classroomId),
  );
  return decrypted != null
    ? { state: "active", last4: row.last4 }
    : { state: "needs-reentry", last4: row.last4 };
}

/**
 * The decrypted key of a classroom the user belongs to, or null when absent,
 * storage is unconfigured, the row is undecryptable, or — crucially — the
 * user is not a member (a forged classroom id must never bill a stranger's
 * classroom).
 */
export async function getClassroomOpenRouterKey(
  userId: string,
  classroomId: string,
): Promise<string | null> {
  const secret = keyStorageSecret();
  if (!secret) return null;
  const membership = await prisma.classroomMembership.findUnique({
    where: { classroomId_userId: { classroomId, userId } },
    select: {
      classroom: {
        select: {
          apiKeys: {
            where: { provider: PROVIDER },
            select: { ciphertext: true },
          },
        },
      },
    },
  });
  const row = membership?.classroom.apiKeys[0];
  if (!row) return null;
  return decryptApiKey(row.ciphertext, secret, classroomKeyAad(classroomId));
}
