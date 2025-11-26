import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Main from "@/components/Main";

export default function Home() {
  return (
    <div className="bg-[url('/img/minecraft.png')] bg-cover bg-top bg-fixed">
      <img
        src="noise.png"
        alt="noise"
        className="opacity-5 fixed inset-0 z-50 pointer-events-none"
      />
      <Hero />
      <Main />
      <Footer />
    </div>
  );
}
