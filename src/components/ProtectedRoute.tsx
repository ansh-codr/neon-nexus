import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isGoogleFitConnected } from '@/firebase/googleFit';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireFit?: boolean;
}

/**
 * Protected Route Component
 * 
 * Enforces:
 * 1. User must be signed in (Google auth)
 * 2. User must have Google Fit connected (if requireFit=true)
 * 
 * Redirects:
 * - Not signed in → /login
 * - Signed in but no Fit → /connect-fit
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireFit = true 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const fitConnected = isGoogleFitConnected();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-mono text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Signed in but no Google Fit → redirect to connect-fit
  if (requireFit && !fitConnected) {
    return <Navigate to="/connect-fit" state={{ from: location.pathname }} replace />;
  }

  // All checks passed
  return <>{children}</>;
};

/**
 * Fit Required Route
 * 
 * For the /connect-fit page itself:
 * - Requires sign-in
 * - Does NOT require Fit (obviously)
 * - Redirects to dashboard if already connected
 */
export const FitSetupRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const fitConnected = isGoogleFitConnected();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: '/connect-fit' }} replace />;
  }

  // Already connected → redirect to intended destination or dashboard
  if (fitConnected) {
    const from = (location.state as { from?: string })?.from || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

/**
 * Auth Route (for login/signup pages)
 * 
 * Redirects authenticated users:
 * - If no Fit → /connect-fit
 * - If has Fit → /dashboard
 */
export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const fitConnected = isGoogleFitConnected();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Already signed in
  if (user) {
    if (!fitConnected) {
      return <Navigate to="/connect-fit" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
