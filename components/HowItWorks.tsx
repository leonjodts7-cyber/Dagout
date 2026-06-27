const STEPS = [
  {
    number: "1",
    title: "Beschrijf jullie dag",
    description: "Typ in gewone taal wat jullie zoeken",
  },
  {
    number: "2",
    title: "AI vindt de match",
    description: "Onze AI analyseert en selecteert de beste opties",
  },
  {
    number: "3",
    title: "Neem contact op",
    description: "Stuur direct een aanvraag naar de aanbieder",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-[30px] font-bold text-[#111827]">
          Hoe werkt Dagout?
        </h2>

        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-7 hidden border-t-2 border-dashed border-[#d1d5db] md:block"
            aria-hidden
          />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0fdf4] text-2xl font-extrabold text-[#1D9E75]">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#111827]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] text-[#6b7280]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
