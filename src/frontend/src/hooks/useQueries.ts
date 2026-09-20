import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Data, Data__1, Data__2, Id, Status } from "../backend";
import { useActor } from "./useActor";

// ─── Job Descriptions ────────────────────────────────────────────────────────

export function useListJobDescriptions() {
  const { actor, isFetching } = useActor();
  return useQuery<Data__2[]>({
    queryKey: ["jobDescriptions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listJobDescriptions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJobDescription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      requiredSkills: string[];
      qualifications: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addJobDescription(
        params.title,
        params.description,
        params.requiredSkills,
        params.qualifications,
        BigInt(Date.now()),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobDescriptions"] });
    },
  });
}

export function useDeleteJobDescription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteJobDescription(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobDescriptions"] });
    },
  });
}

// ─── Resumes ─────────────────────────────────────────────────────────────────

export function useListResumes() {
  const { actor, isFetching } = useActor();
  return useQuery<Data__1[]>({
    queryKey: ["resumes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listResumes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddResume() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      candidateName: string;
      fileName: string;
      rawText: string;
      skills: string[];
      education: string[];
      experience: string[];
      certifications: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addResume(
        params.candidateName,
        params.fileName,
        params.rawText,
        params.skills,
        params.education,
        params.experience,
        params.certifications,
        BigInt(Date.now()),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

// ─── Matching / Results ───────────────────────────────────────────────────────

export function useBatchMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobDescriptionId: Id) => {
      if (!actor) throw new Error("Not connected");
      return actor.batchMatch(jobDescriptionId);
    },
    onSuccess: (_, jobDescriptionId) => {
      queryClient.invalidateQueries({
        queryKey: ["candidateResults", jobDescriptionId.toString()],
      });
    },
  });
}

export function useGetAllCandidateResultsByJob(jobDescriptionId: Id | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Data[]>({
    queryKey: ["candidateResults", jobDescriptionId?.toString()],
    queryFn: async () => {
      if (!actor || jobDescriptionId === null) return [];
      return actor.getAllCandidateResultsByJob(jobDescriptionId);
    },
    enabled: !!actor && !isFetching && jobDescriptionId !== null,
  });
}

export function useGetCandidateResultsByStatus(
  jobDescriptionId: Id | null,
  status: Status,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Data[]>({
    queryKey: ["candidateResults", jobDescriptionId?.toString(), status],
    queryFn: async () => {
      if (!actor || jobDescriptionId === null) return [];
      return actor.getCandidateResultsByJobAndStatus(jobDescriptionId, status);
    },
    enabled: !!actor && !isFetching && jobDescriptionId !== null,
  });
}

export function useShortlistCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resultId: Id) => {
      if (!actor) throw new Error("Not connected");
      return actor.shortlistCandidate(resultId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateResults"] });
    },
  });
}

export function useRejectCandidate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (resultId: Id) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectCandidate(resultId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateResults"] });
    },
  });
}
