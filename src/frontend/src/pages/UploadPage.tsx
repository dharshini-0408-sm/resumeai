import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useAddResume, useListResumes } from "../hooks/useQueries";
import { type ParsedResume, parseResume } from "../utils/resumeParser";

interface ResumeItem {
  file: File;
  parsed: ParsedResume | null;
  parsing: boolean;
  error: string | null;
  expanded: boolean;
}

const ocidIndex = (i: number) => {
  if (i === 0) return "upload.resume_item.1";
  if (i === 1) return "upload.resume_item.2";
  return "upload.resume_item.3";
};

export function UploadPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addResume = useAddResume();
  const { data: existingResumes, isLoading: loadingResumes } = useListResumes();

  const processFiles = useCallback(async (files: File[]) => {
    const pdfFiles = files.filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf"),
    );
    if (pdfFiles.length === 0) {
      toast.error("Please upload PDF files only.");
      return;
    }

    const newItems: ResumeItem[] = pdfFiles.map((file) => ({
      file,
      parsed: null,
      parsing: true,
      error: null,
      expanded: false,
    }));

    setResumes((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      try {
        const parsed = await parseResume(item.file);
        setResumes((prev) =>
          prev.map((r) =>
            r.file === item.file ? { ...r, parsed, parsing: false } : r,
          ),
        );
      } catch {
        setResumes((prev) =>
          prev.map((r) =>
            r.file === item.file
              ? { ...r, parsing: false, error: "Failed to parse resume" }
              : r,
          ),
        );
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      void processFiles(files);
    },
    [processFiles],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      void processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const removeResume = (file: File) => {
    setResumes((prev) => prev.filter((r) => r.file !== file));
  };

  const toggleExpand = (file: File) => {
    setResumes((prev) =>
      prev.map((r) => (r.file === file ? { ...r, expanded: !r.expanded } : r)),
    );
  };

  const handleSubmit = async () => {
    const ready = resumes.filter((r) => r.parsed && !r.error);
    if (ready.length === 0) {
      toast.error("No parsed resumes ready to submit.");
      return;
    }

    setSubmitStatus("submitting");
    let successCount = 0;
    let errorCount = 0;

    for (const resume of ready) {
      if (!resume.parsed) continue;
      try {
        await addResume.mutateAsync({
          candidateName: resume.parsed.candidateName,
          fileName: resume.file.name,
          rawText: resume.parsed.rawText,
          skills: resume.parsed.skills,
          education: resume.parsed.education,
          experience: resume.parsed.experience,
          certifications: resume.parsed.certifications,
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (errorCount === 0) {
      setSubmitStatus("success");
      toast.success(`${successCount} resume(s) uploaded successfully!`);
      setResumes([]);
    } else {
      setSubmitStatus("error");
      toast.error(
        `${successCount} uploaded, ${errorCount} failed. Check your connection.`,
      );
    }

    setTimeout(() => setSubmitStatus("idle"), 3000);
  };

  const readyCount = resumes.filter((r) => r.parsed && !r.error).length;

  return (
    <div className="container mx-auto px-4 lg:px-6 py-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Upload size={20} className="text-primary" />
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
            Upload Resumes
          </h1>
        </div>
        <p className="text-muted-foreground">
          Upload PDF resumes to extract candidate information automatically.
        </p>
      </div>

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer mb-8 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/70 hover:border-primary/50 hover:bg-accent/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-ocid="upload.dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? "gradient-brand" : "bg-primary/10"
            }`}
          >
            <Upload
              size={26}
              className={isDragging ? "text-white" : "text-primary"}
            />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">
              {isDragging
                ? "Drop your PDF files here"
                : "Drag & drop PDF resumes here"}
            </p>
            <p className="text-muted-foreground text-sm">
              or{" "}
              <span className="text-primary underline underline-offset-2 hover:text-primary/80">
                click to browse files
              </span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            data-ocid="upload.upload_button"
          >
            <Upload size={14} />
            Select PDFs
          </Button>
          <p className="text-xs text-muted-foreground">
            Supports: PDF files only. Multiple files allowed.
          </p>
        </div>
      </motion.div>

      {/* Resume List */}
      <AnimatePresence>
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base text-foreground">
                Uploaded Resumes ({resumes.length})
              </h2>
              {readyCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {readyCount} ready to submit
                </Badge>
              )}
            </div>

            {resumes.map((resume, idx) => (
              <motion.div
                key={resume.file.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="rounded-xl border border-border/70 bg-card overflow-hidden"
                data-ocid={idx < 3 ? ocidIndex(idx) : undefined}
              >
                {/* Resume Header */}
                <div className="flex items-center gap-3 p-4">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      resume.parsing
                        ? "bg-muted"
                        : resume.error
                          ? "bg-destructive/10"
                          : "bg-primary/10"
                    }`}
                  >
                    {resume.parsing ? (
                      <Loader2
                        size={16}
                        className="text-muted-foreground animate-spin"
                      />
                    ) : resume.error ? (
                      <AlertCircle size={16} className="text-destructive" />
                    ) : (
                      <FileText size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {resume.parsed?.candidateName || resume.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {resume.file.name} •{" "}
                      {(resume.file.size / 1024).toFixed(0)}KB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {resume.parsing && (
                      <span className="text-xs text-muted-foreground">
                        Parsing...
                      </span>
                    )}
                    {resume.parsed && !resume.error && (
                      <CheckCircle2 size={16} className="text-green-500" />
                    )}
                    {resume.parsed && (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => toggleExpand(resume.file)}
                      >
                        {resume.expanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      onClick={() => removeResume(resume.file)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Parsing progress */}
                {resume.parsing && (
                  <div className="px-4 pb-4">
                    <Progress value={undefined} className="h-1 animate-pulse" />
                  </div>
                )}

                {/* Expanded parsed details */}
                <AnimatePresence>
                  {resume.expanded && resume.parsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/60 px-4 pb-4 pt-3 grid sm:grid-cols-2 gap-4">
                        <ParsedField
                          label="Skills"
                          items={resume.parsed.skills}
                          color="bg-blue-100 text-blue-700"
                        />
                        <ParsedField
                          label="Education"
                          items={resume.parsed.education}
                          color="bg-purple-100 text-purple-700"
                        />
                        <ParsedField
                          label="Experience"
                          items={resume.parsed.experience}
                          color="bg-emerald-100 text-emerald-700"
                        />
                        <ParsedField
                          label="Certifications"
                          items={resume.parsed.certifications}
                          color="bg-orange-100 text-orange-700"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      {resumes.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            size="lg"
            className="w-full sm:w-auto gradient-brand text-white border-0 gap-2 min-w-[180px]"
            onClick={() => void handleSubmit()}
            disabled={
              submitStatus === "submitting" ||
              readyCount === 0 ||
              resumes.some((r) => r.parsing)
            }
            data-ocid="upload.submit_button"
          >
            {submitStatus === "submitting" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Submit {readyCount} Resume{readyCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>

          {submitStatus === "submitting" && (
            <div
              className="flex items-center gap-2 text-sm text-muted-foreground"
              data-ocid="upload.loading_state"
            >
              <Loader2 size={14} className="animate-spin" />
              Processing resumes...
            </div>
          )}
          {submitStatus === "success" && (
            <div
              className="flex items-center gap-2 text-sm text-green-600"
              data-ocid="upload.success_state"
            >
              <CheckCircle2 size={14} />
              Resumes uploaded successfully!
            </div>
          )}
          {submitStatus === "error" && (
            <div
              className="flex items-center gap-2 text-sm text-destructive"
              data-ocid="upload.error_state"
            >
              <AlertCircle size={14} />
              Some uploads failed. Please retry.
            </div>
          )}
        </div>
      )}

      {/* Existing Resumes */}
      <div className="mt-12">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">
          Previously Uploaded Resumes
        </h2>
        {loadingResumes ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : !existingResumes || existingResumes.length === 0 ? (
          <div
            className="rounded-xl border border-dashed border-border/60 p-8 text-center"
            data-ocid="upload.empty_state"
          >
            <FileText
              size={28}
              className="mx-auto mb-2 text-muted-foreground"
            />
            <p className="text-muted-foreground text-sm">
              No resumes uploaded yet. Upload some PDFs above!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {existingResumes.map((resume) => (
              <div
                key={resume.id.toString()}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-card border border-border/60"
              >
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {resume.candidateName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {resume.fileName} • {resume.skills.length} skills extracted
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {resume.skills.length} skills
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ParsedField({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 8).map((item) => (
          <span
            key={item}
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}
          >
            {item}
          </span>
        ))}
        {items.length > 8 && (
          <span className="text-xs text-muted-foreground">
            +{items.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
}
