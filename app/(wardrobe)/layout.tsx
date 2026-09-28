import { AppShell } from "@/components/app-shell";
export const metadata = { robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
