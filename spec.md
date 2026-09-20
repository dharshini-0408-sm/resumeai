# RecruitAI

## Current State
New project with no existing code. Starting from scratch.

## Requested Changes (Diff)

### Add
- Recruiter authentication (login/logout) with role-based access
- Resume upload page supporting multiple PDF files
- Job description input page with required skills and qualifications
- AI-based resume parsing: extract skills, education, experience, certifications from PDF text
- Candidate matching engine: compare extracted resume data against job description and compute a match score (0-100%)
- Candidate ranking dashboard: display candidates sorted by match score, with shortlist/reject actions
- Home/landing page for the platform

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
1. Data models: Recruiter, Resume (parsed fields: skills, education, experience, certifications, raw text), JobDescription, CandidateResult (resumeId, matchScore, status: pending/shortlisted/rejected)
2. Auth: recruiter login with username/password stored on-chain
3. Resume management: store uploaded resume text/metadata, return resume list per recruiter
4. Job description management: store job description with required skills per recruiter
5. Matching logic: keyword/skill-based matching between resume fields and job description to compute a match score
6. Candidate actions: shortlist or reject a candidate result

### Frontend (React + TypeScript)
1. Home page: marketing/info page with login CTA
2. Login page: recruiter credentials form
3. Resume upload page: drag-and-drop or file picker for multiple PDFs, client-side PDF text extraction, submit to backend
4. Job description page: textarea for job description, skills input, submit
5. Candidate ranking dashboard: table/card list sorted by match score, filter by status (all/shortlisted/rejected), shortlist/reject actions per candidate
6. Navigation: sidebar or top nav linking all pages, protected routes for authenticated recruiters
