import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import FitCarousel from "@/components/custom/fit-carousel";


export default function Home() {
  
  return (
    <div className="flex flex-col items-center h-screen justify-center gap-16">
      <FitCarousel/>
      <p className="text-6xl font-bold z-10">
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
        href="/tryon"
        className="rounded-xl bg-green px-12 py-4 hover:scale-105 transition-all text-white text-2xl font-bold"
      >
        Try Now
      </Link>
    </div>
  );
}
