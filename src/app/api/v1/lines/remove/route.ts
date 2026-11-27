import { NextResponse } from "next/server";
import { removeLine } from "@/lib/server/lines";

export async function POST(req: Request) {
    const body = await req.json();
    const {line_id } = body;

    // Validate request
    if (!Number.isInteger(line_id))
        return NextResponse.json({ error: "expected { line_id: int }" }, { status: 400 });

    // Remove the line
    const line = await removeLine(line_id);
    if (!line)
        return NextResponse.json({ error: "line not found" }, { status: 404 });

    return NextResponse.json(line);
}