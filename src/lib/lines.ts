import {db} from "@/prisma/db";
import {CodeLine, CodeLineList} from "@/types/line";

export async function getCurrentLines() : Promise<CodeLineList> {

    // Get all the active lines
    const raw_lines = await db.orm.public.Line
        .where({deleted: false})
        .orderBy((l) => l.id.asc())
        .all();

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


export async function addLine(newText: string) : Promise<CodeLine> {
    return db.transaction(async (tx) => {

        // Save the added line
        const last = await tx.orm.public.Line.orderBy((l) => l.id.desc()).first();
        const line = await tx.orm.public.Line.create({prevLineId: last?.id, text: newText});

        // Store line creation for history
        await tx.orm.public.Action.create({
            type: "INSERT", lineId: line.id, prevLineId: last?.id, newText,
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