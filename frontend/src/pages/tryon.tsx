import { useState } from "react";
import Curated from "@/components/custom/curated";
import Custom from "@/components/custom/custom";
import ViewToggle from "@/components/custom/viewtoggle";

type View = 'curated' | 'custom';

export default function TryOn() {
  const [view, setView] = useState<View>("curated");

  return (
    <div className="flex p-6 ">
      <div className="w-[45%]">
        <ViewToggle activeView={view} setView={setView} />
        {view === 'curated' ? <Curated /> : <Custom />}
      </div>
      <div className="w-[55%]">Avatar</div>
    </div>
  );
}
