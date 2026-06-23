import Link from "next/link";
import { TOOLS_LINKS } from "@/lib/tools-constants";

const CARD_STYLES: Record<string, { bg: string; iconBg: string }> = {
  calculator: { bg: "bg-[#eff6ff]", iconBg: "bg-blue-500 text-white" },
  vote: { bg: "bg-[#f0fdf4]", iconBg: "bg-[#1D9E75] text-white" },
  assistant: { bg: "bg-[#faf5ff]", iconBg: "bg-purple-500 text-white" },
};

function ToolIcon({ icon }: { icon: string }) {
  const paths: Record<string, string> = {
    calculator:
      "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    vote: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    assistant: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  };

  return (
    <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon] ?? paths.assistant} />
    </svg>
  );
}

export default function ToolsSection() {
  return (
    <section id="tools" className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Handige tools voor jullie teambuilding
        </h2>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {TOOLS_LINKS.map((tool) => {
            const styles = CARD_STYLES[tool.icon] ?? CARD_STYLES.assistant;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`card-hover group flex min-h-[280px] flex-col rounded-2xl p-8 ${styles.bg}`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${styles.iconBg}`}
                >
                  <ToolIcon icon={tool.icon} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{tool.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {tool.description}
                </p>
                <span className="mt-6 inline-flex w-fit items-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1D9E75] shadow-sm transition-all duration-150 group-hover:bg-[#1D9E75] group-hover:text-white">
                  Open tool →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
