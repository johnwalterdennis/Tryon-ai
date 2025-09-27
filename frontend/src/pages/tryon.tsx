import { useState } from "react";
import Curated from "@/components/custom/curated";
import Custom from "@/components/custom/custom";
import ViewToggle from "@/components/custom/viewtoggle";

type View = 'curated' | 'custom';

export default function TryOn() {
  const [view, setView] = useState<View>("curated");

  return (
    <div className="flex">
      <div className="w-[50%]">
        <ViewToggle activeView={view} setView={setView} />
        {view === 'curated' ? <Curated /> : <Custom />}
      </div>
      <div className="w-[50%]">Avatar</div>
    </div>
  );
}
