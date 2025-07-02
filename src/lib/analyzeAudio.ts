// src/lib/analyzeAudio.ts

import axios from "axios";
import fs from "fs-extra";
import path from "path";

const baseUrl = "https://api.assemblyai.com/v2";
const headers = {
  authorization: process.env.ASSEMBLYAI_API_KEY!,
  "content-type": "application/json",
};

export async function transcribeAudio(filePath: string): Promise<string> {
  // Step 1: Read and upload audio
  const audioData = await fs.readFile(filePath);

  const uploadRes = await axios.post(`${baseUrl}/upload`, audioData, {
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      "content-type": "application/octet-stream",
    },
  });

  const audioUrl = uploadRes.data.upload_url;

  // Step 2: Request transcription
  const transcriptRes = await axios.post(
    `${baseUrl}/transcript`,
    {
      audio_url: audioUrl,
      speech_model: "universal",
    },
    { headers }
  );

  const transcriptId = transcriptRes.data.id;
  const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

  // Step 3: Poll until done
  while (true) {
    const pollingRes = await axios.get(pollingEndpoint, { headers });
    const result = pollingRes.data;

    if (result.status === "completed") {
      return result.text;
    } else if (result.status === "error") {
      throw new Error(`❌ Transcription failed: ${result.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}
