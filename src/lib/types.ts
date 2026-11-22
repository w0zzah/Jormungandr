export type Line = {
  id: number;
  prev_line_id: number;
  text: string;
  updated_by: number;
  updated_at: number | null;
  color: string;
}

export type currentUser = {
  user: { id: number; name: string; } | null;
  can_edit: boolean;
  resets_at: number;
}

export type Mode = 
  { kind: "edit"; id: number; } |
  { kind: "add"; after: number | null}
