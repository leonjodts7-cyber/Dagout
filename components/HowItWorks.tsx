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
      <div className="mx-auto max-w-[800px] px-6">
        <h2 className="text-center text-[28px] font-bold text-[#111827]">
          Hoe werkt Dagout?
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <span className="block text-[48px] font-extrabold leading-none text-[#d1fae5]">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-[#111827]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] text-[#6b7280]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
