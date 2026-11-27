import { NextResponse } from "next/server";
import {editLine, isValidText} from "@/lib/server/lines";

export async function POST(req: Request) {

    const body = await req.json();
    const {line_id, new_text} = body;

    // Validate request
    if (!Number.isInteger(line_id) || !isValidText(new_text))
        return NextResponse.json({ error: "expected { line_id: int, new_text: string }" }, { status: 400 });

    // Try to update the line
    const line = await editLine(line_id, new_text);
    if (!line)
        return NextResponse.json({ error: "line not found" }, { status: 404 });

    return NextResponse.json(line);
}