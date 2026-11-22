import { NextResponse } from "next/server";
import { addLine } from "@/lib/lines";

export async function POST(req: Request) {

    const body = await req.json();
    const {new_text} = body;

    // Validate request
    if (typeof new_text !== "string")
        return NextResponse.json({ error: "expected { new_text: string }" }, { status: 400 });

    // Add the line
    return NextResponse.json(await addLine(new_text), { status: 201 });
}