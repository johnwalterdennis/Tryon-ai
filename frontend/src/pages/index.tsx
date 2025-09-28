import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import FitCarousel from "@/components/custom/fit-carousel";
import Navbar from "@/components/custom/navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen justify-center gap-16">
      <Navbar/>
      <FitCarousel />
      <div className="bg-darkpink/50 backdrop-blur-sm flex flex-col items-center gap-16 w-[60%] py-16 rounded-2xl shadow-black/30 shadow-xl">
        <p className="text-6xl font-bold z-10 text-rose-950 cursor-default">
          See yourself in
          <Typewriter
            words={[" anything!", " pants!", " shirts!", " hats!"]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </p>
        <Link
          href="/uploadpage"
          className="rounded-xl bg-darkpink/90 px-12 py-4 hover:scale-105 transition-all text-rose-950 text-2xl font-bold  shadow-black/20 shadow-xl"
        >
          Try now
        </Link>
      </div>
    </div>
  );
}
