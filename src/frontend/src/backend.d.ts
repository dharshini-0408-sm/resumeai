import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Data {
    id: Id;
    status: Status;
    jobDescriptionId: Id;
    createdAt: bigint;
    recruiterId: Principal;
    matchScore: bigint;
    resumeId: Id;
    candidateName: string;
    matchedSkills: Array<string>;
}
export interface Data__2 {
    id: Id;
    title: string;
    createdAt: bigint;
    recruiterId: Principal;
    description: string;
    qualifications: Array<string>;
    requiredSkills: Array<string>;
}
export type Id = bigint;
export interface UserProfile {
    name: string;
}
export interface Data__1 {
    id: Id;
    rawText: string;
    education: Array<string>;
    recruiterId: Principal;
    fileName: string;
    experience: Array<string>;
    candidateName: string;
    certifications: Array<string>;
    skills: Array<string>;
    uploadedAt: bigint;
}
export enum Status {
    pending = "pending",
    rejected = "rejected",
    shortlisted = "shortlisted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJobDescription(title: string, description: string, requiredSkills: Array<string>, qualifications: Array<string>, createdAt: bigint): Promise<Data__2>;
    addResume(candidateName: string, fileName: string, rawText: string, skills: Array<string>, education: Array<string>, experience: Array<string>, certifications: Array<string>, uploadedAt: bigint): Promise<Data__1>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    batchMatch(jobDescriptionId: Id): Promise<Array<Data>>;
    deleteJobDescription(id: Id): Promise<void>;
    deleteResume(id: Id): Promise<void>;
    getAllCandidateResultsByJob(jobDescriptionId: Id): Promise<Array<Data>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidateResultsByJobAndStatus(jobDescriptionId: Id, status: Status): Promise<Array<Data>>;
    getJobDescription(id: Id): Promise<Data__2>;
    getResume(id: Id): Promise<Data__1>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listJobDescriptions(): Promise<Array<Data__2>>;
    listResumes(): Promise<Array<Data__1>>;
    matchResumeToJob(resumeId: Id, jobDescriptionId: Id): Promise<Data>;
    rejectCandidate(resultId: Id): Promise<Data>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    shortlistCandidate(resultId: Id): Promise<Data>;
}
