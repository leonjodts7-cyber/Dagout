const STEPS = [
  {
    number: "01",
    title: "Beschrijf jullie dag",
    description: "Typ in gewone taal wat jullie zoeken",
  },
  {
    number: "02",
    title: "AI vindt de match",
    description: "Onze AI analyseert en selecteert de beste opties",
  },
  {
    number: "03",
    title: "Neem contact op",
    description: "Stuur direct een aanvraag naar de aanbieder",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-[28px] font-bold text-gray-900">
          Hoe werkt Dagout?
        </h2>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <div
            className="absolute left-[16.67%] right-[16.67%] top-8 hidden h-px bg-[#d1fae5] md:block"
            aria-hidden
          />

          {STEPS.map((step) => (
            <div key={step.number} className="relative text-center">
              <span className="text-4xl font-bold text-[#bbf7d0]">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
