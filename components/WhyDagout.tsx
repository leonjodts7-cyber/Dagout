function SearchIcon() {
  return (
    <svg className="h-10 w-10 text-[#1D9E75]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg className="h-10 w-10 text-[#1D9E75]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg className="h-10 w-10 text-[#1D9E75]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

const ITEMS = [
  {
    icon: SearchIcon,
    title: "AI zoekfunctie",
    text: "Typ in gewone taal wat jullie zoeken. Geen filters, geen gedoe.",
  },
  {
    icon: MapIcon,
    title: "Alles in Vlaanderen",
    text: "Van kajakken tot kookworkshops, van Gent tot Hasselt.",
  },
  {
    icon: ContactIcon,
    title: "Direct contact",
    text: "Stuur aanvragen en plan jullie dag in één platform.",
  },
];

export default function WhyDagout() {
  return (
    <section className="bg-[#f9fafb] px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-[32px] font-bold text-gray-900">
          Waarom Dagout?
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
