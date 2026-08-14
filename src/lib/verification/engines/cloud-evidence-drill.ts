const ACTOR_TERMS =
  /\b(actor|customer|entity|identity|owner|owners|ownership|beneficial|who|person|people|user)\b/i;

const ACTIVITY_TERMS =
  /\b(account activity|activity|compute|flops|gpu|hardware|metric|metrics|operation|operations|power|resource|resources|technical|telemetry|usage|workload)\b/i;

const CONTRAST_TERMS =
  /\b(but|compared|contrast|different|other|others|rather|remaining|three|whereas|while)\b/i;

/**
 * The response is intentionally evaluated as a compact concept check rather
 * than by exact wording. A sufficient sentence distinguishes actor/identity
 * evidence from measurements of compute activity.
 */
export function explainsOddCloudObservable(response: string) {
  const normalized = response.trim().replace(/\s+/g, " ");
  return (
    normalized.length >= 28 &&
    ACTOR_TERMS.test(normalized) &&
    ACTIVITY_TERMS.test(normalized) &&
    CONTRAST_TERMS.test(normalized)
  );
}
