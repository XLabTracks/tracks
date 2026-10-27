const ACTOR_TERMS =
  /\b(actor|customer|entity|identity|owner|owners|ownership|beneficial|who|person|people|user)\b/i;

const ACTIVITY_TERMS =
  /\b(account activity|activity|compute|consumption|flops|gpu|hardware|measure|measured|measurement|measurements|metric|metrics|operation|operations|power|resource|resources|technical|telemetry|usage|use|used|utilization|utilisation|workload)\b/i;

const CONTRAST_TERMS =
  /\b(but|compared|contrast|different|differs|not|only|other|others|rather|remaining|rest|than|three|versus|vs|whereas|while)\b/i;

export const ODD_PRINCIPLE_MIN_CHARS = 28;

export function answeredOddCloudObservable(
  itemId: string | null,
  response: string,
): boolean {
  return Boolean(itemId) && response.trim().length >= ODD_PRINCIPLE_MIN_CHARS;
}

export function explainsOddCloudObservable(response: string) {
  const normalized = response.trim().replace(/\s+/g, " ");
  return (
    normalized.length >= ODD_PRINCIPLE_MIN_CHARS &&
    ACTOR_TERMS.test(normalized) &&
    ACTIVITY_TERMS.test(normalized) &&
    CONTRAST_TERMS.test(normalized)
  );
}
