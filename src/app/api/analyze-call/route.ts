import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/analyzeAudio';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(os.tmpdir(), file.name);
    fs.writeFileSync(tempPath, buffer);

    const transcriptResult = await transcribeAudio(tempPath);

    return NextResponse.json(transcriptResult);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("❌ Server error:", error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
