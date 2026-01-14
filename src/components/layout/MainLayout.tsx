// src/components/layout/MainLayout.tsx
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {children}
    </div>
  );
}
