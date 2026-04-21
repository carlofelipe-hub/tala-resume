"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TalaButton } from "@/components/tala/tala-button";
import { TalaMeta } from "@/components/tala/tala-meta";
import { TalaProgress } from "@/components/tala/tala-progress";
import { uploadResume, processResume } from "./actions";
import type { ResumeRecord } from "@/types/resume";

type Stage = "idle" | "uploading" | "extracting" | "analyzing" | "complete" | "error";

const stageLabels: Record<Stage, { tagalog: string; english: string }> = {
  idle: { tagalog: "Pumili ng PDF", english: "Choose a PDF file" },
  uploading: { tagalog: "Ina-upload...", english: "Uploading your résumé..." },
  extracting: { tagalog: "Binabasa ni Tala...", english: "Extracting text..." },
  analyzing: { tagalog: "Sinusuri ni Tala...", english: "Analyzing with Tala..." },
  complete: { tagalog: "Tapos na!", english: "Analysis complete!" },
  error: { tagalog: "May problema", english: "Something went wrong" },
};

const stageProgress: Record<Stage, number> = {
  idle: 0,
  uploading: 20,
  extracting: 45,
  analyzing: 70,
  complete: 100,
  error: 0,
};

interface UploadFormProps {
  existingResume: ResumeRecord | null;
}

export function UploadForm({ existingResume }: UploadFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>(
    existingResume?.status === "error" ? "error" : "idle"
  );
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(
    existingResume?.error_message ?? null
  );

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      setError("PDF files lang ang pwede. / Only PDF files are accepted.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Masyadong malaki ang file. Max 5MB. / File must be under 5MB.");
      return;
    }
    setFile(f);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  async function handleSubmit() {
    if (!file) return;

    setError(null);

    try {
      setStage("uploading");
      const formData = new FormData();
      formData.append("file", file);

      const uploadResult = await uploadResume(formData);
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      setStage("extracting");
      await new Promise((r) => setTimeout(r, 500));

      setStage("analyzing");
      const processResult = await processResume(uploadResult.resumeId!);
      if (processResult.error) {
        throw new Error(processResult.error);
      }

      setStage("complete");
      router.push(`/upload?id=${uploadResult.resumeId}`);
    } catch (err) {
      setStage("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const isProcessing = stage === "uploading" || stage === "extracting" || stage === "analyzing";

  return (
    <div className="space-y-6">
      {/* Progress bar during processing */}
      {isProcessing && (
        <div className="space-y-3">
          <TalaProgress value={stageProgress[stage]} />
          <div className="text-center">
            <p className="text-sm font-medium text-tala-ink">
              {stageLabels[stage].tagalog}
            </p>
            <p className="text-xs text-tala-muted">
              {stageLabels[stage].english}
            </p>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!isProcessing && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`rounded-[14px] border-2 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragOver
              ? "border-tala-accent bg-tala-accent-wash/30"
              : file
                ? "border-tala-accent/50 bg-tala-accent-wash/10"
                : "border-tala-rule bg-tala-surface/50 hover:border-tala-muted"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {/* Upload icon */}
          <div className="w-14 h-14 rounded-full bg-tala-accent-wash flex items-center justify-center mb-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-tala-accent-ink"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          {file ? (
            <div>
              <p className="text-sm font-medium text-tala-ink">{file.name}</p>
              <TalaMeta className="mt-1">{formatSize(file.size)}</TalaMeta>
              <p className="text-xs text-tala-muted mt-2">
                Click or drop to change file
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-tala-ink mb-1">
                I-drag ang PDF dito
              </p>
              <p className="text-xs text-tala-muted">
                or click to browse &middot; PDF only &middot; max 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      {!isProcessing && (
        <div className="flex items-center justify-end gap-3">
          <TalaButton
            onClick={handleSubmit}
            disabled={!file}
          >
            Suriin ni Tala
          </TalaButton>
        </div>
      )}
    </div>
  );
}
