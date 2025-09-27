import { useState } from "react";
import Curated from "@/components/custom/curated";
import Custom from "@/components/custom/custom";
import ViewToggle from "@/components/custom/viewtoggle";
import Avatar from "@/components/custom/avatar";

type View = "curated" | "custom";

export default function TryOn() {
  const [view, setView] = useState<View>("curated");

  return (
    <div className="flex p-6 h-screen">
      <div className="w-[45%] h-full">
        <ViewToggle activeView={view} setView={setView} />
        {view === "curated" ? <Curated /> : <Custom />}
      </div>
      <div className="w-[55%]">
        <Avatar />
      </div>
    </div>
  );
}
