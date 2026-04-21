export interface ResumeFinding {
  title: string;
  explanation: string;
  suggestion?: string;
  severity?: 1 | 2 | 3;
}

export interface ResumeAnalysis {
  is_resume: boolean;
  rejection_reason?: string;
  major_issues: ResumeFinding[];
  minor_issues: ResumeFinding[];
  positives: ResumeFinding[];
  summary: string;
}

export interface ResumeRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  extracted_text: string | null;
  analysis: ResumeAnalysis | null;
  status: "uploaded" | "extracting" | "analyzing" | "complete" | "error";
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
