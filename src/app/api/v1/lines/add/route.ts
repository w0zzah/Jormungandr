import { NextResponse } from "next/server";
import { addLine, isValidText } from "@/lib/server/lines";

export async function POST(req: Request) {

    const body = await req.json();
    const {new_text, line_id_above} = body;

    // Validate request
    const aboveOk = line_id_above === undefined || line_id_above === null || Number.isInteger(line_id_above);
    if (!isValidText(new_text) || !aboveOk)
        return NextResponse.json({ error: "malformed request" }, { status: 400 });

    // Add the line
    const line = await addLine(new_text, line_id_above);
    if (!line)
        return NextResponse.json({ error: "line above not found" }, { status: 404 });

    return NextResponse.json(line, { status: 201 });
}