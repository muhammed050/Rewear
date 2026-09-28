import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { AdminConsole } from "@/components/admin-console";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function Page() {
  try {
    await requireAdmin();
  } catch {
    redirect("/sign-in?next=/admin");
  }
  return (
    <main id="main" className="wrap section">
      <AdminConsole />
    </main>
  );
}
