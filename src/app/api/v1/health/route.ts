import { NextResponse } from 'next/server';

export async function GET() {

    return new Response('wazzup', { status: 200 });
}
