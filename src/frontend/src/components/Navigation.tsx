import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Navigation() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
              <BrainCircuit className="h-4.5 w-4.5 text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Recruit<span className="text-primary opacity-70">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              data-ocid="nav.home_link"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                currentPath === "/"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <BrainCircuit size={15} />
              Home
            </Link>
            <Link
              to="/upload"
              data-ocid="nav.upload_link"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                currentPath === "/upload"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Upload size={15} />
              Upload Resumes
            </Link>
            <Link
              to="/job"
              data-ocid="nav.jobs_link"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                currentPath === "/job"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <FileText size={15} />
              Job Descriptions
            </Link>
            <Link
              to="/dashboard"
              search={{ jobId: undefined }}
              data-ocid="nav.dashboard_link"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                currentPath === "/dashboard"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                data-ocid="nav.logout_button"
                className="gap-1.5"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                data-ocid="nav.login_button"
                className="gap-1.5 gradient-brand text-white border-0"
              >
                <LogIn size={14} />
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              <Link
                to="/"
                data-ocid="nav.home_link"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <BrainCircuit size={16} />
                Home
              </Link>
              <Link
                to="/upload"
                data-ocid="nav.upload_link"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/upload"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Upload size={16} />
                Upload Resumes
              </Link>
              <Link
                to="/job"
                data-ocid="nav.jobs_link"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/job"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <FileText size={16} />
                Job Descriptions
              </Link>
              <Link
                to="/dashboard"
                search={{ jobId: undefined }}
                data-ocid="nav.dashboard_link"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPath === "/dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <div className="pt-2 border-t border-border/50">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.logout_button"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gap-1.5 gradient-brand text-white border-0"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn}
                    data-ocid="nav.login_button"
                  >
                    <LogIn size={14} />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
