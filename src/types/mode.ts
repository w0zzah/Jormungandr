export type ModeEdit = {
    kind: "edit";
    id: number;
}

export type ModeAdd = {
    kind: "add";
    after: number | null
}

export type Mode = ModeEdit | ModeAdd;
