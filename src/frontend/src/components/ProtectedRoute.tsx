import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand animate-pulse">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!identity) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
