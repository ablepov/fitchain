import type { ReactNode } from "react";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Header } from "@/components/Header";

interface AppShellProps {
  children: ReactNode;
  title: ReactNode;
  subtitle?: string;
  showTabs?: boolean;
  showBackButton?: boolean;
  backHref?: string;
}

export function AppShell({
  children,
  title,
  subtitle,
  showTabs = true,
  showBackButton = false,
  backHref = "/",
}: AppShellProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} showBackButton={showBackButton} backHref={backHref} />
      {children}
      {showTabs ? <BottomTabBar /> : null}
    </>
  );
}
