import Hero from "@/components/shared/home/Hero";
import PublicFooter from "@/components/shared/home/PublicFooter";
import PublicNavbar from "@/components/shared/home/PublicNavbar";
import Steps from "@/components/shared/home/Steps";
import TopDoctors from "@/components/shared/home/TopDoctors";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="grow">
        <Hero />
        <Steps />
        <TopDoctors />
      </main>
      <PublicFooter />
    </div>
  );
}
