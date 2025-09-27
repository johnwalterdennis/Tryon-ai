import Link from "next/link";

type View = "curated" | "custom";

type ViewToggleProps = {
  activeView: View;
  setView: (view: View) => void;
};

const options: View[] = ["curated", "custom"];

export default function ViewToggle({ activeView, setView }: ViewToggleProps) {
  const activeIndex = Math.max(options.indexOf(activeView), 0);

  return (
    <div className="inline-flex py-4 items-center">
      {/* Back Arrow */}
      <Link
        href="/"
        className="mr-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-darkpink/10 transition-colors"
        aria-label="Back"
      >
        <svg
          className="w-6 h-6 text-darkpink"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
      <div className="relative flex w-64 overflow-hidden rounded-full bg-gray-200">
        <span
          className="pointer-events-none absolute top-0 left-0 h-full w-1/2 rounded-full bg-darkpink transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setView(option)}
            className={`relative z-10 flex-1 rounded-full py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
              activeView === option ? "text-white" : "text-gray-600"
            }`}
            aria-pressed={activeView === option}
          >
            {option === "curated" ? "Curated" : "Custom"}
          </button>
        ))}
      </div>
    </div>
  );
}
