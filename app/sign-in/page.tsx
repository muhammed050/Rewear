import Image from "next/image";
import { Header } from "@/components/header";
import { AuthForm } from "@/components/auth-form";
export const metadata = {
  title: "Your closet is waiting",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <Header />
      <main id="main" className="auth-page">
        <div className="auth-art">
          <Image
            src="/images/inspiration.webp"
            alt="An everyday outfit, reimagined"
            fill
            sizes="50vw"
          />
        </div>
        <AuthForm />
      </main>
    </>
  );
}
