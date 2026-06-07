import Link from "next/link";
import { TOOLS_LINKS } from "@/lib/tools-constants";

function ToolIcon({ icon }: { icon: string }) {
  const paths: Record<string, string> = {
    calculator:
      "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    vote: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    assistant: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  };

  return (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[icon] ?? paths.assistant} />
    </svg>
  );
}

export default function ToolsSection() {
  return (
    <section id="tools" className="bg-[#f8f9fa] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Handige tools voor jullie teambuilding
        </h2>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {TOOLS_LINKS.map((tool) => {
            const isVote = tool.href === "/stemmen/nieuw";

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isVote
                    ? "border-[#1D9E75] shadow-md ring-2 ring-[#1D9E75]/20 lg:scale-[1.03]"
                    : "border-gray-200/60 hover:border-[#1D9E75]"
                }`}
              >
                {isVote && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#1D9E75] px-2.5 py-1 text-xs font-bold text-white">
                    Nieuw
                  </span>
                )}

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                    isVote
                      ? "bg-[#1D9E75] text-white"
                      : "bg-[#1D9E75]/10 text-[#1D9E75] group-hover:bg-[#1D9E75] group-hover:text-white"
                  }`}
                >
                  <ToolIcon icon={tool.icon} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                  {tool.description}
                </p>
                <span className="mt-6 text-sm font-semibold text-[#1D9E75] group-hover:underline">
                  {isVote ? "Start stemronde →" : "Open tool →"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
