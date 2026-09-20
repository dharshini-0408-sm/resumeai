import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Shield,
  Target,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Upload,
    title: "Bulk Resume Upload",
    description:
      "Upload multiple PDF resumes at once. Our system automatically parses and extracts key information.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BrainCircuit,
    title: "AI Skill Extraction",
    description:
      "Advanced text processing automatically identifies skills, education, experience, and certifications.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description:
      "Define job requirements and let AI calculate precise match scores for every candidate.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: TrendingUp,
    title: "Candidate Ranking",
    description:
      "Candidates are ranked by match percentage so you can focus on the most qualified first.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Users,
    title: "Shortlist & Reject",
    description:
      "Quickly shortlist promising candidates or reject unqualified ones with a single click.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description:
      "Enterprise-grade security with decentralized storage on the Internet Computer Protocol.",
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
];

const stats = [
  { value: "10x", label: "Faster Screening" },
  { value: "85%", label: "Accuracy Rate" },
  { value: "500+", label: "Resumes/Hour" },
  { value: "3min", label: "Time to Shortlist" },
];

const steps = [
  {
    step: "01",
    title: "Sign In & Upload",
    desc: "Log in as a recruiter and upload your candidate resumes in PDF format.",
  },
  {
    step: "02",
    title: "Define Requirements",
    desc: "Create a job description with required skills and qualifications.",
  },
  {
    step: "03",
    title: "AI Matching",
    desc: "Run AI-powered analysis to match every resume against your job requirements.",
  },
  {
    step: "04",
    title: "Review Rankings",
    desc: "Review ranked candidates, shortlist the best, and proceed with confidence.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/3 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <Badge className="mb-4 bg-white/15 text-white/90 border-white/20 hover:bg-white/20 text-xs font-medium px-3 py-1">
                <Zap size={11} className="mr-1" />
                AI-Powered Recruitment
              </Badge>
              <h1 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl leading-tight mb-6 text-balance">
                Screen Resumes
                <br />
                <span className="text-white/70">10x Faster</span> with AI
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Automated resume screening, AI-powered matching, and intelligent
                candidate ranking — all in one professional platform designed
                for modern HR teams.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold gap-2 shadow-lg shadow-black/20"
                  data-ocid="home.get_started_button"
                >
                  <Link to="/login">
                    Get Started Free
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 gap-2"
                >
                  <Link to="/dashboard" search={{ jobId: undefined }}>
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10">
                  <img
                    src="/assets/generated/hero-recruitment.dim_1200x600.png"
                    alt="AI Recruitment Platform"
                    className="w-full object-cover"
                  />
                </div>
                {/* Floating stats cards */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Match Score
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        94% — Top Match
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <BrainCircuit size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        AI Analysis
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        48 Skills Found
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/50 bg-card">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="text-center"
              >
                <p className="font-display font-bold text-3xl lg:text-4xl text-primary">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Badge
              variant="secondary"
              className="mb-3 text-xs font-medium px-3 py-1"
            >
              Platform Features
            </Badge>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Everything you need to hire smarter
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              RecruitAI brings together intelligent automation and a clean
              recruiter experience so your team can focus on what matters —
              finding the right people.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div
                  className={`h-10 w-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon size={20} className={feature.color} />
                </div>
                <h3 className="font-display font-semibold text-base text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-card border-y border-border/50">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <Badge
              variant="secondary"
              className="mb-3 text-xs font-medium px-3 py-1"
            >
              How It Works
            </Badge>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-foreground mb-4">
              From upload to shortlist in minutes
            </h2>
          </motion.div>

          <div className="relative grid md:grid-cols-4 gap-8">
            {/* Connection line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <div className="h-16 w-16 rounded-full gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="font-display font-bold text-white text-lg">
                      {step.step}
                    </span>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl gradient-hero p-12 text-center text-white"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
            </div>
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="font-display font-bold text-3xl lg:text-4xl mb-4">
                Ready to transform your hiring process?
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Join hundreds of HR teams using RecruitAI to screen resumes
                faster and hire smarter.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold gap-2 shadow-lg shadow-black/20"
                data-ocid="home.get_started_button"
              >
                <Link to="/login">
                  Start Screening Now
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
