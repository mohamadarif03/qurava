const API_URL =
  process.env.NEXT_PUBLIC_AUDIO_API_URL ??
  "https://crtal-cobytartil-audio-api.hf.space/transcribe";

export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData();
  const audioBlob = new Blob([blob], { type: "audio/webm" });
  form.append("file", audioBlob, "recording.webm");

  const response = await fetch(API_URL, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Transcription API ${response.status}: ${body}`);
  }

  const result: unknown = await response.json();
  if (!isTranscriptResponse(result)) {
    throw new Error("Unexpected transcription response");
  }

  return result.text.trim();
}

function isTranscriptResponse(value: unknown): value is { text: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "text" in value &&
    typeof value.text === "string" &&
    value.text.trim().length > 0
  );
}
