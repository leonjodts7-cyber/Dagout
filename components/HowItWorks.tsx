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
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-[800px]">
        <h2 className="text-center text-[28px] font-bold tracking-tight text-gray-900">
          Hoe werkt Dagout?
        </h2>

        <div className="steps-row relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1D9E75] text-lg font-bold text-[#1D9E75]">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6b7280]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
