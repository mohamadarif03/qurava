"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type BlobHandler = (blob: Blob) => void | Promise<void>;

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") {
      recorder.stop();
    }
  }, []);

  const start = useCallback(
    async (onBlob: BlobHandler, maxMs = 2_000) => {
      if (recorderRef.current?.state === "recording") return;

      const nextStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(nextStream);

      streamRef.current = nextStream;
      recorderRef.current = recorder;
      chunksRef.current = [];

      if (mountedRef.current) {
        setStream(nextStream);
        setIsRecording(true);
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        nextStream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        chunksRef.current = [];

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (mountedRef.current) {
          setStream(null);
          setIsRecording(false);
        }

        void Promise.resolve(onBlob(blob)).catch((error: unknown) => {
          console.error("Audio processing failed:", error);
        });
      };

      recorder.start();
      timeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, maxMs);
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    };
  }, []);

  return { isRecording, stream, start, stop };
}
