import axios from "axios";
import fs from "fs-extra";
import path from "path";

export const parameterMeta = {
  greeting: { inputType: "PASS_FAIL", weight: 5 },
  collectionUrgency: { inputType: "SCORE", weight: 15 },
  rebuttalCustomerHandling: { inputType: "SCORE", weight: 15 },
  callEtiquette: { inputType: "SCORE", weight: 15 },
  callDisclaimer: { inputType: "PASS_FAIL", weight: 5 },
  correctDisposition: { inputType: "PASS_FAIL", weight: 10 },
  callClosing: { inputType: "PASS_FAIL", weight: 5 },
  fatalIdentification: { inputType: "PASS_FAIL", weight: 5 },
  fatalTapeDiscloser: { inputType: "PASS_FAIL", weight: 10 },
  fatalToneLanguage: { inputType: "PASS_FAIL", weight: 15 },
};

const baseUrl = "https://api.assemblyai.com/v2";
const headers = {
  authorization: process.env.ASSEMBLYAI_API_KEY!,
  "content-type": "application/json",
};

export async function transcribeAudio(filePath: string): Promise<any> {
  const audioData = await fs.readFile(filePath);

  const uploadRes = await axios.post(`${baseUrl}/upload`, audioData, {
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      "content-type": "application/octet-stream",
    },
  });
  const audioUrl = uploadRes.data.upload_url;

  const transcriptRes = await axios.post(
    `${baseUrl}/transcript`,
    {
      audio_url: audioUrl,
      speaker_labels: true,
      sentiment_analysis: true,
      entity_detection: true,
      auto_chapters: true,
    },
    { headers }
  );

  const transcriptId = transcriptRes.data.id;
  const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

  while (true) {
    const pollingRes = await axios.get(pollingEndpoint, { headers });
    const result = pollingRes.data;

    if (result.status === "completed") {
      const transcriptText = result.text;
      const scores = generateScores(transcriptText);
      const overallFeedback = "Rule-based feedback applied.";
      const observation = "Scoring based on keyword presence.";
      return {
        transcript: transcriptText,
        scores,
        overallFeedback,
        observation,
      };
    } else if (result.status === "error") {
      throw new Error(`❌ Transcription failed: ${result.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

function generateScores(transcript: string) {
  const lower = transcript.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [key, meta] of Object.entries(parameterMeta)) {
    if (meta.inputType === "PASS_FAIL") {
      scores[key] = checkKeywords(lower, key) ? meta.weight : 0;
    } else if (meta.inputType === "SCORE") {
      const count = keywordCount(lower, key);
      scores[key] = Math.min(meta.weight, count * 3);
    }
  }

  return scores;
}

function checkKeywords(text: string, key: string): boolean {
  const keywords: Record<string, string[]> = {
    greeting: ["hello", "hi", "good morning", "this is"],
    callDisclaimer: ["this call is being recorded", "disclaimer"],
    correctDisposition: ["marking", "tagging", "disposition"],
    callClosing: ["thank you", "have a good day", "bye"],
    fatalIdentification: ["verify your identity", "may i know your name"],
    fatalTapeDiscloser: ["you are being recorded", "tape disclosure"],
    fatalToneLanguage: ["polite", "respect", "calm"],
  };

  return (keywords[key] || []).some((kw) => text.includes(kw));
}

function keywordCount(text: string, key: string): number {
  const keywords: Record<string, string[]> = {
    collectionUrgency: ["urgent", "due", "asap", "immediately", "soon"],
    rebuttalCustomerHandling: ["i understand", "i can help", "let me explain"],
    callEtiquette: ["please", "thank you", "hold on", "appreciate", "sure"],
  };

  return (keywords[key] || []).reduce(
    (count, kw) => count + (text.includes(kw) ? 1 : 0),
    0
  );
}
