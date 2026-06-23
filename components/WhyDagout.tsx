function BrainIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M32 8c-6 0-11 4-12 10-4 1-7 5-7 9 0 3 2 6 5 7-1 5 2 10 7 11 1 5 6 9 12 9s11-4 12-9c5-1 8-6 7-11 3-1 5-4 5-7 0-4-3-8-7-9C43 12 38 8 32 8z"
        fill="#1D9E75"
        fillOpacity="0.15"
        stroke="#1D9E75"
        strokeWidth="2"
      />
      <path d="M32 20v24M24 28c4 2 8 2 16 0M24 36c4 2 8 2 16 0" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="24" r="2" fill="#1D9E75" />
      <circle cx="38" cy="24" r="2" fill="#1D9E75" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M8 20l16-6 16 6 16-6v36l-16 6-16-6-16 6V20z"
        fill="#1D9E75"
        fillOpacity="0.15"
        stroke="#1D9E75"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24 14v36M40 20v36" stroke="#1D9E75" strokeWidth="2" />
      <circle cx="32" cy="30" r="4" fill="#1D9E75" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-12 w-12" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="14" width="44" height="40" rx="4" fill="#1D9E75" fillOpacity="0.15" stroke="#1D9E75" strokeWidth="2" />
      <path d="M10 24h44M22 10v8M42 10v8" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
      <rect x="18" y="32" width="8" height="8" rx="1" fill="#1D9E75" />
      <rect x="30" y="32" width="8" height="8" rx="1" fill="#1D9E75" fillOpacity="0.5" />
      <rect x="42" y="32" width="8" height="8" rx="1" fill="#1D9E75" fillOpacity="0.5" />
    </svg>
  );
}

const REASONS = [
  {
    icon: BrainIcon,
    title: "AI die écht begrijpt wat je wil",
    description:
      "Typ gewoon wat jullie zoeken — locatie, budget, groepsgrootte. Onze AI vertaalt dat naar de beste matches.",
  },
  {
    icon: MapIcon,
    title: "Alles in één overzicht",
    description:
      "Van kajakken in Gent tot escape rooms in Antwerpen. Alle Vlaamse aanbieders op één platform met kaart en filters.",
  },
  {
    icon: CalendarIcon,
    title: "Van idee tot geplande dag",
    description:
      "Combineer activiteiten, stem met je team en deel de planning. Van eerste idee tot bevestigde dag uit.",
  },
];

export default function WhyDagout() {
  return (
    <section className="bg-[#f8f9fa] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Waarom Dagout?
        </h2>
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
          {REASONS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon />
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <blockquote className="mx-auto mt-16 max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg italic leading-relaxed text-gray-700">
            &ldquo;We bespaarden uren zoekwerk. Binnen vijf minuten hadden we de perfecte
            teambuilding voor ons team van 25 personen.&rdquo;
          </p>
          <footer className="mt-4">
            <p className="font-semibold text-gray-900">Sophie Vermeulen</p>
            <p className="text-sm text-gray-500">HR Manager, Belfius</p>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
