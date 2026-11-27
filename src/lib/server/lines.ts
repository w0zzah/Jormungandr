import {db} from "@/prisma/db";
import {CodeLine, CodeLineList} from "@/types/line";
import {ChainedLine} from "@/lib/types";

export const MAX_LINE_LENGTH = 255;

export function isValidText(text: unknown): text is string {
    return typeof text === "string"
        && text.length <= MAX_LINE_LENGTH
        && !text.includes("\n")
        && !text.includes("\r");
}

function sortByChain<T extends ChainedLine>(rows: T[]): T[] {

    // Build map of parent row to child row
    const rowUnder = new Map(rows.map((row) => [row.prevLineId ?? null, row]));

    const sorted: T[] = [];
    let row = rowUnder.get(null);

    // Walk the linked list from first line to the end
    while (row) {
        sorted.push(row);
        row = rowUnder.get(row.id);
    }

    return sorted;
}

export async function getCurrentLines() : Promise<CodeLineList> {

    // Get all the active lines
    const rows = await db.orm.public.Line.all();
    const raw_lines: CodeLine[] = sortByChain(rows)
        .filter((l) => !l.deleted)

    // Simplify line mapping
    const lines : CodeLine[] = raw_lines.map(l => {
        return {
            id: l.id,
            text: l.text,
        }
    })

    return {
        lines,
    };
}

export async function addLine(newText: string, above?: number | null) : Promise<CodeLine | null> {
    return db.transaction(async (tx) => {

        const rows = await tx.orm.public.Line.all();
        const isAddingToEOF = above === undefined;

        // Work out which line the new one goes under
        const lastRow = sortByChain(rows).at(-1);
        const aboveId = isAddingToEOF ? (lastRow?.id ?? null) : above;

        // That line doesn't exist
        if (aboveId !== null && !rows.some((row) => row.id === aboveId))
            return null;

        // Save the new line
        const line = await tx.orm.public.Line.create({prevLineId: aboveId ?? undefined, text: newText});

        // Whatever was under that line now has to go under the new one
        const belowRow = rows.find((row) => (row.prevLineId ?? null) === aboveId);
        if (belowRow)
            await tx.orm.public.Line.where({id: belowRow.id}).update({prevLineId: line.id});

        // Store line creation for history
        await tx.orm.public.Action.create({
            type: "INSERT", lineId: line.id, prevLineId: aboveId ?? undefined, newText,
        });

        return {id: line.id, text: line.text};
    });
}

export async function editLine(lineId: number, newText: string) : Promise<CodeLine | null> {
    return db.transaction(async (tx) => {

        // Line doesn't exist
        const line = await tx.orm.public.Line.first({ id: lineId });
        if (!line || line.deleted)
            return null;

        // No change made to the line
        if (line.text === newText)
            return { id: line.id, text: line.text };

        // Save the new line contents
        await tx.orm.public.Line.where({ id: lineId }).update({ text: newText });

        // Store line change for history
        await tx.orm.public.Action.create({
            type: "UPDATE", lineId, oldText: line.text, newText,
        });

        return { id: lineId, text: newText };
    });
}

export async function removeLine(lineId: number): Promise<CodeLine | null> {
    return db.transaction(async (tx) => {

        // Line doesn't exist
        const line = await tx.orm.public.Line.first({id: lineId});
        if (!line || line.deleted)
            return null;

        // Mark it deleted instead of removing the row as history and neighbours still point at it
        await tx.orm.public.Line.where({id: lineId}).update({deleted: true});

        // Store line removal for history
        await tx.orm.public.Action.create({
            type: "DELETE", lineId, oldText: line.text,
        });

        return {id: line.id, text: line.text};
    });
}