import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center bg-[#0a2a1f] px-6 py-24 text-center">
        <p className="text-6xl font-extrabold text-[#1D9E75]">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Deze pagina bestaat niet
        </h1>
        <p className="mt-4 max-w-md text-white/70">
          De link is verbroken of de pagina is verplaatst. Ga terug naar de
          homepage om verder te zoeken.
        </p>
        <Link
          href="/"
          className="mt-10 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#1D9E75] transition-colors hover:bg-white/90"
        >
          Ga naar homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
