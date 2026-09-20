import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  Star,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Data } from "../backend";
import { Status } from "../backend";
import {
  useGetAllCandidateResultsByJob,
  useListJobDescriptions,
  useRejectCandidate,
  useShortlistCandidate,
} from "../hooks/useQueries";

type FilterTab = "all" | "shortlisted" | "rejected";

function getScoreClass(score: number): string {
  if (score >= 70) return "score-high";
  if (score >= 40) return "score-medium";
  return "score-low";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Low";
  return "Poor";
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${getScoreClass(score)}`}
    >
      <TrendingUp size={12} />
      {score}%
    </span>
  );
}

const ocidCandidateItem = (i: number) => {
  if (i === 0) return "dashboard.candidate_item.1";
  if (i === 1) return "dashboard.candidate_item.2";
  return undefined;
};

const ocidShortlistBtn = (i: number) =>
  i === 0 ? "dashboard.shortlist_button.1" : undefined;
const ocidRejectBtn = (i: number) =>
  i === 0 ? "dashboard.reject_button.1" : undefined;

export function DashboardPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/dashboard" });
  const jobIdParam = (search as { jobId?: string }).jobId;

  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [expandedCandidates, setExpandedCandidates] = useState<Set<string>>(
    new Set(),
  );

  const { data: jobs, isLoading: loadingJobs } = useListJobDescriptions();
  const selectedJobId = jobIdParam ? BigInt(jobIdParam) : null;

  const { data: candidates, isLoading: loadingCandidates } =
    useGetAllCandidateResultsByJob(selectedJobId);
  const shortlist = useShortlistCandidate();
  const reject = useRejectCandidate();

  const handleJobChange = (value: string) => {
    void navigate({ to: "/dashboard", search: { jobId: value } });
  };

  const handleShortlist = async (candidate: Data) => {
    try {
      await shortlist.mutateAsync(candidate.id);
      toast.success(`${candidate.candidateName} shortlisted!`);
    } catch {
      toast.error("Failed to shortlist candidate.");
    }
  };

  const handleReject = async (candidate: Data) => {
    try {
      await reject.mutateAsync(candidate.id);
      toast.warning(`${candidate.candidateName} rejected.`);
    } catch {
      toast.error("Failed to reject candidate.");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Sort by match score descending
  const sorted = [...(candidates ?? [])].sort(
    (a, b) => Number(b.matchScore) - Number(a.matchScore),
  );

  const filtered = sorted.filter((c) => {
    if (filterTab === "all") return true;
    if (filterTab === "shortlisted") return c.status === Status.shortlisted;
    if (filterTab === "rejected") return c.status === Status.rejected;
    return true;
  });

  // Stats
  const totalCandidates = sorted.length;
  const shortlisted = sorted.filter(
    (c) => c.status === Status.shortlisted,
  ).length;
  const rejected = sorted.filter((c) => c.status === Status.rejected).length;
  const avgScore =
    totalCandidates > 0
      ? Math.round(
          sorted.reduce((s, c) => s + Number(c.matchScore), 0) /
            totalCandidates,
        )
      : 0;

  const selectedJob = jobs?.find((j) => j.id === selectedJobId);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-10 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={20} className="text-primary" />
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
              Candidate Rankings
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            AI-ranked candidates sorted by match percentage
          </p>
        </div>

        {/* Job Selector */}
        <div className="sm:w-64">
          {loadingJobs ? (
            <Skeleton className="h-9 w-64" />
          ) : (
            <Select
              value={selectedJobId?.toString() ?? ""}
              onValueChange={handleJobChange}
              data-ocid="dashboard.tab"
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select a job..." />
              </SelectTrigger>
              <SelectContent>
                {(jobs ?? []).map((job) => (
                  <SelectItem key={job.id.toString()} value={job.id.toString()}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Stats Row */}
      {selectedJobId && totalCandidates > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            {
              label: "Total Candidates",
              value: totalCandidates,
              icon: Users,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Avg. Match Score",
              value: `${avgScore}%`,
              icon: TrendingUp,
              color: "text-cyan-600",
              bg: "bg-cyan-50",
            },
            {
              label: "Shortlisted",
              value: shortlisted,
              icon: Star,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Rejected",
              value: rejected,
              icon: XCircle,
              color: "text-red-500",
              bg: "bg-red-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon size={16} className={stat.color} />
                </div>
              </div>
              <p className="font-display font-bold text-xl text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Job info */}
      {selectedJob && (
        <div className="mb-5 p-3.5 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2.5">
          <AlertCircle size={15} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {selectedJob.title}
            </p>
            {selectedJob.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedJob.requiredSkills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {selectedJob.requiredSkills.length > 6 && (
                  <span className="text-xs text-muted-foreground">
                    +{selectedJob.requiredSkills.length - 6} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {selectedJobId && (
        <Tabs
          value={filterTab}
          onValueChange={(v) => setFilterTab(v as FilterTab)}
          className="mb-5"
          data-ocid="dashboard.filter.tab"
        >
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              All ({totalCandidates})
            </TabsTrigger>
            <TabsTrigger value="shortlisted" className="text-xs">
              Shortlisted ({shortlisted})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">
              Rejected ({rejected})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Candidate List */}
      {!selectedJobId ? (
        <div
          className="rounded-xl border border-dashed border-border/60 p-12 text-center"
          data-ocid="dashboard.empty_state"
        >
          <LayoutDashboard
            size={32}
            className="mx-auto mb-3 text-muted-foreground"
          />
          <p className="font-medium text-foreground mb-1">
            Select a job to view rankings
          </p>
          <p className="text-sm text-muted-foreground">
            Choose a job description from the dropdown above to see AI-ranked
            candidates.
          </p>
        </div>
      ) : loadingCandidates ? (
        <div className="space-y-3" data-ocid="dashboard.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-border/60 p-12 text-center"
          data-ocid="dashboard.empty_state"
        >
          <Users size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium text-foreground mb-1">
            {filterTab === "all"
              ? "No candidates matched yet"
              : `No ${filterTab} candidates`}
          </p>
          <p className="text-sm text-muted-foreground">
            {filterTab === "all"
              ? 'Go to Job Descriptions and click "Run AI Match" to get rankings.'
              : `Switch to "All" tab to see pending candidates.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((candidate, idx) => {
            const score = Number(candidate.matchScore);
            const id = candidate.id.toString();
            const isExpanded = expandedCandidates.has(id);
            const initials = candidate.candidateName
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-border/70 bg-card overflow-hidden"
                data-ocid={idx < 2 ? ocidCandidateItem(idx) : undefined}
              >
                <div className="flex items-center gap-3 p-4">
                  {/* Rank */}
                  <div className="shrink-0 w-6 text-center">
                    <span className="text-xs font-bold text-muted-foreground">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">
                      {initials || <User size={14} />}
                    </span>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-semibold text-sm text-foreground">
                        {candidate.candidateName}
                      </p>
                      <StatusBadge status={candidate.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={score}
                        className="h-1.5 flex-1 max-w-[120px]"
                      />
                      <span className="text-xs text-muted-foreground">
                        {getScoreLabel(score)}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <ScoreBadge score={score} />

                  {/* Expand */}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    onClick={() => toggleExpand(id)}
                  >
                    {isExpanded ? (
                      <ChevronDown size={15} />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                  </button>
                </div>

                {/* Expanded Skills */}
                <AnimatePresence>
                  {isExpanded && candidate.matchedSkills.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Matched Skills ({candidate.matchedSkills.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.matchedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-muted/30">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`gap-1.5 text-xs h-8 ${
                      candidate.status === Status.shortlisted
                        ? "border-green-300 text-green-600 bg-green-50"
                        : "hover:border-green-300 hover:text-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => void handleShortlist(candidate)}
                    disabled={
                      shortlist.isPending ||
                      candidate.status === Status.shortlisted
                    }
                    data-ocid={ocidShortlistBtn(idx)}
                  >
                    {shortlist.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    {candidate.status === Status.shortlisted
                      ? "Shortlisted"
                      : "Shortlist"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`gap-1.5 text-xs h-8 ${
                      candidate.status === Status.rejected
                        ? "border-red-300 text-red-500 bg-red-50"
                        : "hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                    }`}
                    onClick={() => void handleReject(candidate)}
                    disabled={
                      reject.isPending || candidate.status === Status.rejected
                    }
                    data-ocid={ocidRejectBtn(idx)}
                  >
                    {reject.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {candidate.status === Status.rejected
                      ? "Rejected"
                      : "Reject"}
                  </Button>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(Number(candidate.createdAt)).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === Status.shortlisted)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
        <Star size={10} />
        Shortlisted
      </span>
    );
  if (status === Status.rejected)
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium flex items-center gap-1">
        <XCircle size={10} />
        Rejected
      </span>
    );
  return null;
}
