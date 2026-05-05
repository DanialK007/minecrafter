import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";

export default function GalleryPage() {
  return (
    <div className="bg-[url('/img/minecraft.png')] bg-cover bg-top bg-fixed">
      <img
        src="/noise.png"
        alt="noise"
        className="opacity-10 fixed inset-0 size-full bg-black z-50 pointer-events-none"
      />
      <Hero />
      <Gallery />
      <Footer />
    </div>
  );
}

