import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Play,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type KeyboardEvent, useState } from "react";
import { toast } from "sonner";
import type { Data__2 } from "../backend";
import {
  useAddJobDescription,
  useBatchMatch,
  useDeleteJobDescription,
  useListJobDescriptions,
} from "../hooks/useQueries";

const ocidJobItem = (i: number) => {
  if (i === 0) return "job.item.1";
  if (i === 1) return "job.item.2";
  return undefined;
};
const ocidRunMatch = (i: number) =>
  i === 0 ? "job.run_match_button.1" : undefined;
const ocidDeleteJob = (i: number) =>
  i === 0 ? "job.delete_button.1" : undefined;

export function JobDescriptionPage() {
  const navigate = useNavigate();
  const { data: jobs, isLoading } = useListJobDescriptions();
  const addJob = useAddJobDescription();
  const deleteJob = useDeleteJobDescription();
  const batchMatch = useBatchMatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [qualInput, setQualInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const addTag = (
    input: string,
    setInput: (v: string) => void,
    tags: string[],
    setTags: (v: string[]) => void,
  ) => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setInput("");
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(skillInput, setSkillInput, skills, setSkills);
    }
  };

  const handleQualKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(qualInput, setQualInput, qualifications, setQualifications);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Job title is required.");
      return;
    }
    setFormStatus("submitting");
    try {
      await addJob.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        requiredSkills: skills,
        qualifications,
      });
      setFormStatus("success");
      toast.success("Job description added successfully!");
      setTitle("");
      setDescription("");
      setSkills([]);
      setQualifications([]);
      setTimeout(() => setFormStatus("idle"), 2000);
    } catch {
      setFormStatus("error");
      toast.error("Failed to add job description.");
      setTimeout(() => setFormStatus("idle"), 2000);
    }
  };

  const handleDelete = async (job: Data__2) => {
    try {
      await deleteJob.mutateAsync(job.id);
      toast.success(`Deleted "${job.title}"`);
    } catch {
      toast.error("Failed to delete job description.");
    }
  };

  const handleRunMatch = async (job: Data__2) => {
    try {
      toast.info(`Running AI match for "${job.title}"...`);
      await batchMatch.mutateAsync(job.id);
      toast.success("Matching complete! Redirecting to dashboard...");
      await navigate({
        to: "/dashboard",
        search: { jobId: job.id.toString() },
      });
    } catch {
      toast.error("Matching failed. Make sure resumes are uploaded.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={20} className="text-primary" />
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
            Job Descriptions
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage job requirements and run AI matching against your uploaded
          resumes.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Job List */}
        <div>
          <h2 className="font-display font-semibold text-base text-foreground mb-4">
            Active Job Descriptions ({jobs?.length ?? 0})
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div
              className="rounded-xl border border-dashed border-border/60 p-10 text-center"
              data-ocid="job.empty_state"
            >
              <FileText
                size={28}
                className="mx-auto mb-2 text-muted-foreground"
              />
              <p className="text-muted-foreground text-sm font-medium mb-1">
                No job descriptions yet
              </p>
              <p className="text-muted-foreground text-xs">
                Add your first job description using the form on the right.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, idx) => {
                const id = job.id.toString();
                const isExpanded = expandedJobs.has(id);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border/70 bg-card overflow-hidden"
                    data-ocid={ocidJobItem(idx)}
                  >
                    <div className="flex items-start gap-3 p-4">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground">
                            {job.title}
                          </h3>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            onClick={() => toggleExpand(id)}
                          >
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar size={11} />
                          <span>
                            {new Date(
                              Number(job.createdAt),
                            ).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            {job.requiredSkills.length} required skills
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/50 px-4 pt-3 pb-2 space-y-3">
                            {job.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {job.description}
                              </p>
                            )}
                            {job.requiredSkills.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                                  Required Skills
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {job.requiredSkills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {job.qualifications.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                                  Qualifications
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {job.qualifications.map((q) => (
                                    <span
                                      key={q}
                                      className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                                    >
                                      {q}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-muted/30">
                      <Button
                        size="sm"
                        className="gap-1.5 gradient-brand text-white border-0 text-xs h-8"
                        onClick={() => void handleRunMatch(job)}
                        disabled={batchMatch.isPending}
                        data-ocid={ocidRunMatch(idx)}
                      >
                        {batchMatch.isPending ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Play size={12} />
                        )}
                        Run AI Match
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-destructive hover:border-destructive/50 ml-auto"
                        onClick={() => void handleDelete(job)}
                        disabled={deleteJob.isPending}
                        data-ocid={ocidDeleteJob(idx)}
                      >
                        <Trash2 size={12} />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Job Form */}
        <div>
          <div className="rounded-xl border border-border/70 bg-card p-6 sticky top-20">
            <h2 className="font-display font-semibold text-base text-foreground mb-5 flex items-center gap-2">
              <Plus size={16} className="text-primary" />
              New Job Description
            </h2>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-title" className="text-sm font-medium">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-ocid="job.title_input"
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="job-description"
                  className="text-sm font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe the role, responsibilities, and team..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-ocid="job.description_textarea"
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>

              {/* Skills Tag Input */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Required Skills</Label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Add skill, press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    data-ocid="job.skills_input"
                    className="h-9 text-sm flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5"
                    onClick={() =>
                      addTag(skillInput, setSkillInput, skills, setSkills)
                    }
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs gap-1 pr-1"
                      >
                        {skill}
                        <button
                          type="button"
                          className="hover:text-destructive transition-colors"
                          onClick={() =>
                            setSkills(skills.filter((s) => s !== skill))
                          }
                        >
                          <X size={10} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Qualifications Tag Input */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Qualifications</Label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="e.g. Bachelor's Degree, 3+ years"
                    value={qualInput}
                    onChange={(e) => setQualInput(e.target.value)}
                    onKeyDown={handleQualKeyDown}
                    data-ocid="job.qualifications_input"
                    className="h-9 text-sm flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5"
                    onClick={() =>
                      addTag(
                        qualInput,
                        setQualInput,
                        qualifications,
                        setQualifications,
                      )
                    }
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                {qualifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {qualifications.map((q) => (
                      <Badge
                        key={q}
                        variant="secondary"
                        className="text-xs gap-1 pr-1"
                      >
                        {q}
                        <button
                          type="button"
                          className="hover:text-destructive transition-colors"
                          onClick={() =>
                            setQualifications(
                              qualifications.filter((x) => x !== q),
                            )
                          }
                        >
                          <X size={10} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Status messages */}
              {formStatus === "error" && (
                <div
                  className="flex items-center gap-2 text-sm text-destructive"
                  data-ocid="job.error_state"
                >
                  <AlertCircle size={14} />
                  Failed to add job description.
                </div>
              )}
              {formStatus === "success" && (
                <div
                  className="flex items-center gap-2 text-sm text-green-600"
                  data-ocid="job.success_state"
                >
                  <CheckCircle2 size={14} />
                  Job description added!
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-brand text-white border-0 gap-1.5"
                disabled={formStatus === "submitting"}
                data-ocid="job.submit_button"
              >
                {formStatus === "submitting" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Add Job Description
                  </>
                )}
              </Button>

              {formStatus === "submitting" && (
                <div
                  className="text-center text-xs text-muted-foreground"
                  data-ocid="job.loading_state"
                >
                  Saving to blockchain...
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
