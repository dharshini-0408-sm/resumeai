import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  module Resume {
    public type Id = Nat;
    public type Data = {
      id : Id;
      recruiterId : Principal;
      candidateName : Text;
      fileName : Text;
      rawText : Text;
      skills : [Text];
      education : [Text];
      experience : [Text];
      certifications : [Text];
      uploadedAt : Int;
    };
  };

  module JobDescription {
    public type Id = Nat;
    public type Data = {
      id : Id;
      recruiterId : Principal;
      title : Text;
      description : Text;
      requiredSkills : [Text];
      qualifications : [Text];
      createdAt : Int;
    };
  };

  module CandidateResult {
    public type Id = Nat;
    public type Status = { #pending; #shortlisted; #rejected };
    public type Data = {
      id : Id;
      resumeId : Resume.Id;
      jobDescriptionId : JobDescription.Id;
      recruiterId : Principal;
      candidateName : Text;
      matchScore : Nat;
      matchedSkills : [Text];
      status : Status;
      createdAt : Int;
    };

    public func compareByMatchScore(a : Data, b : Data) : Order.Order {
      Nat.compare(b.matchScore, a.matchScore); // Descending order
    };
  };

  var nextResumeId = 0;
  var nextJobDescriptionId = 0;
  var nextCandidateResultId = 0;

  let resumes = Map.empty<Resume.Id, Resume.Data>();
  let jobDescriptions = Map.empty<JobDescription.Id, JobDescription.Data>();
  let candidateResults = Map.empty<CandidateResult.Id, CandidateResult.Data>();

  // Resume management
  public shared ({ caller }) func addResume(
    candidateName : Text,
    fileName : Text,
    rawText : Text,
    skills : [Text],
    education : [Text],
    experience : [Text],
    certifications : [Text],
    uploadedAt : Int,
  ) : async Resume.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add resumes");
    };

    let resume : Resume.Data = {
      id = nextResumeId;
      recruiterId = caller;
      candidateName;
      fileName;
      rawText;
      skills;
      education;
      experience;
      certifications;
      uploadedAt;
    };

    resumes.add(nextResumeId, resume);
    nextResumeId += 1;
    resume;
  };

  public query ({ caller }) func listResumes() : async [Resume.Data] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list resumes");
    };
    resumes.values().toArray().filter(
      func(resume) {
        resume.recruiterId == caller;
      }
    );
  };

  public query ({ caller }) func getResume(id : Resume.Id) : async Resume.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get resumes");
    };
    switch (resumes.get(id)) {
      case (null) { Runtime.trap("Resume not found") };
      case (?resume) {
        if (resume.recruiterId != caller) { Runtime.trap("Unauthorized: Resume does not belong to you") };
        resume;
      };
    };
  };

  public shared ({ caller }) func deleteResume(id : Resume.Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete resumes");
    };
    switch (resumes.get(id)) {
      case (null) { Runtime.trap("Resume not found") };
      case (?resume) {
        if (resume.recruiterId != caller) { Runtime.trap("Unauthorized: Resume does not belong to you") };
        resumes.remove(id);
      };
    };
  };

  // Job description management
  public shared ({ caller }) func addJobDescription(
    title : Text,
    description : Text,
    requiredSkills : [Text],
    qualifications : [Text],
    createdAt : Int,
  ) : async JobDescription.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add job descriptions");
    };

    let jobDescription : JobDescription.Data = {
      id = nextJobDescriptionId;
      recruiterId = caller;
      title;
      description;
      requiredSkills;
      qualifications;
      createdAt;
    };

    jobDescriptions.add(nextJobDescriptionId, jobDescription);
    nextJobDescriptionId += 1;
    jobDescription;
  };

  public query ({ caller }) func listJobDescriptions() : async [JobDescription.Data] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list job descriptions");
    };
    jobDescriptions.values().toArray().filter(
      func(jobDescription) {
        jobDescription.recruiterId == caller;
      }
    );
  };

  public query ({ caller }) func getJobDescription(id : JobDescription.Id) : async JobDescription.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get job descriptions");
    };
    switch (jobDescriptions.get(id)) {
      case (null) { Runtime.trap("Job description not found") };
      case (?jobDescription) {
        if (jobDescription.recruiterId != caller) { Runtime.trap("Unauthorized: Job description does not belong to you") };
        jobDescription;
      };
    };
  };

  public shared ({ caller }) func deleteJobDescription(id : JobDescription.Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete job descriptions");
    };
    switch (jobDescriptions.get(id)) {
      case (null) { Runtime.trap("Job description not found") };
      case (?jobDescription) {
        if (jobDescription.recruiterId != caller) {
          Runtime.trap("Unauthorized: Job description does not belong to you");
        };
        jobDescriptions.remove(id);
      };
    };
  };

  // Matching
  public shared ({ caller }) func matchResumeToJob(
    resumeId : Resume.Id,
    jobDescriptionId : JobDescription.Id,
  ) : async CandidateResult.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can match resumes to jobs");
    };

    let resume = switch (resumes.get(resumeId)) {
      case (null) { Runtime.trap("Resume not found") };
      case (?resume) {
        if (resume.recruiterId != caller) {
          Runtime.trap("Unauthorized: Resume does not belong to you");
        };
        resume;
      };
    };

    let jobDescription = switch (jobDescriptions.get(jobDescriptionId)) {
      case (null) { Runtime.trap("Job description not found") };
      case (?job) {
        if (job.recruiterId != caller) {
          Runtime.trap("Unauthorized: Job description does not belong to you");
        };
        job;
      };
    };

    // Extract required skills
    let jobRequiredSkills = jobDescription.requiredSkills;
    let candidateSkills = resume.skills.concat(resume.experience).concat(resume.education);

    // Find matched skills (case-insensitive)
    let matchedSkillsList = List.empty<Text>();

    for (jobSkill in jobRequiredSkills.values()) {
      for (candidateSkill in candidateSkills.values()) {
        if (jobSkill.toLower().contains(#text(candidateSkill.toLower()))) {
          matchedSkillsList.add(jobSkill);
        };
      };
    };

    // Calculate match score
    let matchedSkillsSize = matchedSkillsList.size();
    let totalRequiredSkills = jobRequiredSkills.size();

    let matchScore = if (totalRequiredSkills == 0) { 0 } else {
      Nat.min(100, (matchedSkillsSize * 100) / totalRequiredSkills);
    };

    let candidateResult : CandidateResult.Data = {
      id = nextCandidateResultId;
      resumeId;
      jobDescriptionId;
      recruiterId = caller;
      candidateName = resume.candidateName;
      matchScore;
      matchedSkills = matchedSkillsList.toArray();
      status = #pending;
      createdAt = 0; // Set createdAt later if needed
    };

    candidateResults.add(nextCandidateResultId, candidateResult);
    nextCandidateResultId += 1;
    candidateResult;
  };

  // Batch match
  public shared ({ caller }) func batchMatch(
    jobDescriptionId : JobDescription.Id,
  ) : async [CandidateResult.Data] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can batch match");
    };

    // Find all resumes for the current recruiter
    let recruiterResumes = resumes.values().toArray().filter(
      func(resume) {
        resume.recruiterId == caller;
      }
    );

    let candidateResultsArray = recruiterResumes.map(func(resume) { return matchHelper(resume, jobDescriptionId) });

    let sortedResults = candidateResultsArray.sort(CandidateResult.compareByMatchScore);
    sortedResults;
  };

  func matchHelper(resume : Resume.Data, jobDescriptionId : JobDescription.Id) : CandidateResult.Data {
    let jobDescription = switch (jobDescriptions.get(jobDescriptionId)) {
      case (null) { Runtime.trap("Job description not found") };
      case (?jobDescription) { jobDescription };
    };

    // Extract required skills
    let jobRequiredSkills = jobDescription.requiredSkills;
    let candidateSkills = resume.skills.concat(resume.experience).concat(resume.education);

    // Find matched skills (case-insensitive)
    let matchedSkillsList = List.empty<Text>();

    for (jobSkill in jobRequiredSkills.values()) {
      for (candidateSkill in candidateSkills.values()) {
        if (jobSkill.toLower().contains(#text(candidateSkill.toLower()))) {
          matchedSkillsList.add(jobSkill);
        };
      };
    };

    // Calculate match score
    let matchedSkillsSize = matchedSkillsList.size();
    let totalRequiredSkills = jobRequiredSkills.size();

    let matchScore = if (totalRequiredSkills == 0) { 0 } else {
      Nat.min(100, (matchedSkillsSize * 100) / totalRequiredSkills);
    };

    let candidateResult : CandidateResult.Data = {
      id = nextCandidateResultId;
      resumeId = resume.id;
      jobDescriptionId;
      recruiterId = resume.recruiterId;
      candidateName = resume.candidateName;
      matchScore;
      matchedSkills = matchedSkillsList.toArray();
      status = #pending;
      createdAt = 0; // Set createdAt later if needed
    };

    candidateResults.add(nextCandidateResultId, candidateResult);
    nextCandidateResultId += 1;
    candidateResult;
  };

  // Candidate actions
  public shared ({ caller }) func shortlistCandidate(resultId : CandidateResult.Id) : async CandidateResult.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can shortlist candidates");
    };

    let candidateResult = switch (candidateResults.get(resultId)) {
      case (null) { Runtime.trap("Candidate result not found") };
      case (?result) {
        if (result.recruiterId != caller) {
          Runtime.trap("Unauthorized: Candidate result does not belong to you");
        };
        result;
      };
    };

    let updatedResult = { candidateResult with status = #shortlisted };
    candidateResults.add(resultId, updatedResult);
    updatedResult;
  };

  public shared ({ caller }) func rejectCandidate(resultId : CandidateResult.Id) : async CandidateResult.Data {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reject candidates");
    };

    let candidateResult = switch (candidateResults.get(resultId)) {
      case (null) { Runtime.trap("Candidate result not found") };
      case (?result) {
        if (result.recruiterId != caller) {
          Runtime.trap("Unauthorized: Candidate result does not belong to you");
        };
        result;
      };
    };

    let updatedResult = { candidateResult with status = #rejected };
    candidateResults.add(resultId, updatedResult);
    updatedResult;
  };

  public query ({ caller }) func getAllCandidateResultsByJob(jobDescriptionId : JobDescription.Id) : async [CandidateResult.Data] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get candidate results");
    };
    let results = candidateResults.values().toArray().filter(
      func(result) {
        result.jobDescriptionId == jobDescriptionId and result.recruiterId == caller
      }
    );
    results.sort(CandidateResult.compareByMatchScore);
  };

  public query ({ caller }) func getCandidateResultsByJobAndStatus(jobDescriptionId : JobDescription.Id, status : CandidateResult.Status) : async [CandidateResult.Data] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get candidate results");
    };
    let results = candidateResults.values().toArray().filter(
      func(result) {
        result.jobDescriptionId == jobDescriptionId and result.recruiterId == caller and result.status == status
      }
    );
    results.sort(CandidateResult.compareByMatchScore);
  };
};
