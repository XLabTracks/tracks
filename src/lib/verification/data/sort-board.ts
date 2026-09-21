export type SortVerdict = "right" | "defensible" | "miss";

export interface SortZone {
  id: string;
  name: string;
  blurb: string;
  color: string;
}

export interface SortItem {
  id: string;
  label: string;
  detail: string;
  zone: string;
  ok: string;
  near?: Record<string, string>;
  wrong?: Record<string, string>;
  generic: string;
}

export interface SortBoardDef {
  id: string;
  storageKey: string;
  lead: string;
  trayLabel: string;
  zones: SortZone[];
  items: SortItem[];
  reveal: string;
}

export type SortPlacements = Record<string, string>;
