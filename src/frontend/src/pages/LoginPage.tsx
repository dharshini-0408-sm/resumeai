import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BrainCircuit, Loader2, Lock, LogIn, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const benefits = [
  { icon: Shield, text: "Secure decentralized authentication" },
  { icon: Zap, text: "One-click login — no passwords" },
  { icon: Lock, text: "Your data stays private and encrypted" },
];

export function LoginPage() {
  const { identity, login, isLoggingIn, isInitializing, loginError } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      void navigate({ to: "/dashboard", search: { jobId: undefined } });
    }
  }, [identity, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border/60 shadow-2xl shadow-primary/5">
        {/* Left: Brand Panel */}
        <div className="gradient-hero text-white p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 border border-white/20">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl">RecruitAI</span>
            </div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl leading-tight mb-4">
              Welcome back,
              <br />
              Recruiter
            </h1>
            <p className="text-white/70 leading-relaxed mb-8">
              Sign in to access your recruitment dashboard, upload resumes, and
              find the perfect candidates with AI-powered matching.
            </p>
            <div className="flex flex-col gap-3">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-md bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <b.icon size={14} />
                  </div>
                  <span className="text-white/80 text-sm">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-white/50 text-xs">
              Powered by Internet Computer Protocol
            </p>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="bg-card p-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                Sign in to your account
              </h2>
              <p className="text-muted-foreground text-sm">
                Use Internet Identity to authenticate securely.
              </p>
            </div>

            {loginError && (
              <div
                className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                data-ocid="login.error_state"
              >
                {loginError.message}
              </div>
            )}

            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full gradient-brand text-white border-0 gap-2 font-semibold h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                data-ocid="login.submit_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In with Internet Identity
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                No account needed. Internet Identity creates a secure,
                passwordless identity for you.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                By signing in, you agree to use RecruitAI responsibly for lawful
                recruitment purposes only.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
