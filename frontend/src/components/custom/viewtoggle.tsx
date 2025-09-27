type View = "curated" | "custom";

type ViewToggleProps = {
  activeView: View;
  setView: (view: View) => void;
};

export default function ViewToggle({ activeView, setView }: ViewToggleProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => setView("curated")}
        className={
          activeView === "curated" ? "bg-green text-white" : "bg-gray-200"
        }
      >
        Curated
      </button>
      <button
        onClick={() => setView("custom")}
        className={
          activeView === "custom" ? "bg-green text-white" : "bg-gray-200"
        }
      >
        Custom
      </button>
    </div>
  );
}
