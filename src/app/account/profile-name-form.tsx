"use client";

import { useState, useTransition } from "react";

import { saveProfileName } from "@/app/actions/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * The one editable field on the account page.
 *
 * Save is disabled until the value actually differs from what is stored, so
 * the button never invites a write that would change nothing, and the
 * confirmation clears the moment the field is edited again — a "Saved" that
 * outlives its edit is a lie about state.
 */
export function ProfileNameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [saved, setSaved] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = name.trim() !== saved && name.trim().length > 0;

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await saveProfileName(name);
      if (res.ok) {
        setSaved(res.name);
        setName(res.name);
        setDone(true);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (dirty && !pending) submit();
      }}
    >
      <Label htmlFor="profile-name">Profile name</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id="profile-name"
          value={name}
          maxLength={80}
          autoComplete="name"
          aria-describedby="profile-name-help"
          onChange={(e) => {
            setName(e.target.value);
            setDone(false);
            setError(null);
          }}
          className="max-w-sm"
        />
        <Button type="submit" size="sm" disabled={!dirty || pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {done && !dirty ? (
          <span className="text-muted-foreground text-sm">Saved</span>
        ) : null}
      </div>
      <p id="profile-name-help" className="text-muted-foreground text-sm">
        Shown beside your work in classrooms. It is not how you sign in.
      </p>
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </form>
  );
}
