export interface ParsedResume {
  candidateName: string;
  skills: string[];
  education: string[];
  experience: string[];
  certifications: string[];
  rawText: string;
}

/**
 * Extract text from a PDF file using FileReader (text fallback)
 */
async function extractTextFromPdf(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else if (result instanceof ArrayBuffer) {
        // Try to decode as text
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const text = decoder.decode(result);
        // Extract readable portions from PDF binary - keep only printable ASCII and whitespace
        const readable = Array.from(text)
          .map((ch) => {
            const code = ch.charCodeAt(0);
            return code >= 32 || code === 9 || code === 10 || code === 13
              ? ch
              : " ";
          })
          .join("")
          .replace(/\s+/g, " ")
          .trim();
        resolve(readable);
      } else {
        resolve("");
      }
    };
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

/**
 * Parse a section from text based on header keywords
 */
function extractSection(text: string, headers: string[]): string[] {
  const lines = text.split(/\n|\r\n|\r/);
  const results: string[] = [];
  let inSection = false;
  const sectionEndRegex =
    /^(education|experience|work experience|skills|technical skills|certifications?|certificates?|projects?|references?|summary|objective|profile|languages?|awards?|activities?)\s*[:\-]?\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const isHeader = headers.some(
      (h) =>
        line.toLowerCase().startsWith(h.toLowerCase()) ||
        line.toLowerCase().includes(`${h.toLowerCase()}:`),
    );

    if (isHeader) {
      inSection = true;
      // Grab content on the same line after the colon
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const inline = line.slice(colonIdx + 1).trim();
        if (inline) results.push(inline);
      }
      continue;
    }

    if (inSection) {
      if (sectionEndRegex.test(line) && !isHeader) {
        inSection = false;
        continue;
      }
      if (line.length > 2 && line.length < 300) {
        results.push(line);
      }
    }
  }

  return results.filter((l) => l.length > 0);
}

/**
 * Extract skills using common patterns
 */
function extractSkills(text: string): string[] {
  const skillHeaders = [
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "competencies",
    "technologies",
    "tools",
    "languages",
    "frameworks",
    "expertise",
  ];
  const rawSkills = extractSection(text, skillHeaders);

  const skills: string[] = [];
  for (const line of rawSkills) {
    // Split by common delimiters
    const parts = line
      .split(/[,•|\t]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    skills.push(...parts);
  }

  // Deduplicate and filter too-long lines
  return [...new Set(skills)].filter(
    (s) => s.length > 1 && s.length < 50 && !s.match(/^\d+$/),
  );
}

/**
 * Extract candidate name (first non-empty line that looks like a name)
 */
function extractCandidateName(text: string, fallbackName: string): string {
  const lines = text
    .split(/\n|\r\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 5)) {
    // A name-like line: 2-4 words, mostly alpha, reasonable length
    if (
      line.length > 3 &&
      line.length < 50 &&
      /^[A-Z][a-zA-Z.\s'-]+$/.test(line) &&
      line.split(" ").length >= 2 &&
      line.split(" ").length <= 5
    ) {
      return line;
    }
  }
  return fallbackName;
}

/**
 * Parse a resume file into structured data
 */
export async function parseResume(file: File): Promise<ParsedResume> {
  const rawText = await extractTextFromPdf(file);
  const fallbackName = file.name
    .replace(/\.(pdf|txt|doc|docx)$/i, "")
    .replace(/[-_]/g, " ");

  const candidateName = extractCandidateName(rawText, fallbackName);

  const skills = extractSkills(rawText);

  const education = extractSection(rawText, [
    "education",
    "academic",
    "qualifications",
    "degree",
    "university",
    "college",
  ]);

  const experience = extractSection(rawText, [
    "experience",
    "work experience",
    "employment",
    "work history",
    "professional experience",
    "career",
    "positions",
  ]);

  const certifications = extractSection(rawText, [
    "certifications",
    "certificates",
    "certifications & licenses",
    "credentials",
    "accreditation",
    "professional certifications",
  ]);

  return {
    candidateName,
    skills: skills.slice(0, 30),
    education: education.slice(0, 10),
    experience: experience.slice(0, 20),
    certifications: certifications.slice(0, 10),
    rawText: rawText.slice(0, 5000),
  };
}
