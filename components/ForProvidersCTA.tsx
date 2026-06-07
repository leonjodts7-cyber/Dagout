import Link from "next/link";

export default function ForProvidersCTA() {
  return (
    <section className="bg-[#0a2a1f] px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ben jij een teambuilding aanbieder?
        </h2>
        <p className="mt-4 text-lg text-white">
          Zet je activiteit op Dagout en bereik Belgische bedrijven die op zoek
          zijn naar teambuilding
        </p>
        <Link
          href="/aanbieders/nieuw"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#1D9E75] transition-all hover:bg-white/90 hover:shadow-lg"
        >
          Lijst je activiteit gratis
        </Link>
      </div>
    </section>
  );
}
