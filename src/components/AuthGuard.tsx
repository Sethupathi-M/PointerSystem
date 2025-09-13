"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIdentityContext } from "./IdentityContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoggedIn } = useIdentityContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on login page or if authenticated
    if (pathname === "/login" || isLoggedIn) {
      return;
    }

    // Redirect to login for protected routes
    router.push("/login");
  }, [isLoggedIn, router, pathname]);

  // Show loading/spinner while checking auth, then render children if authenticated
  if (!isLoggedIn && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
