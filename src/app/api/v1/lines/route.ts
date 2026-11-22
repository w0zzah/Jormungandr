import { NextResponse } from "next/server";
import { getCurrentLines } from "../../../../lib/server/lines";

export async function GET() {
    return NextResponse.json(await getCurrentLines());
}