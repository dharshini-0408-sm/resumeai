import { BrainCircuit, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="border-t border-border/50 bg-background py-6 mt-auto">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded gradient-brand">
              <BrainCircuit size={12} className="text-white" />
            </div>
            <span className="font-display font-semibold text-foreground">
              RecruitAI
            </span>
          </div>
          <p className="flex items-center gap-1.5">
            &copy; {year}. Built with{" "}
            <Heart size={13} className="text-red-500 fill-red-500" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
