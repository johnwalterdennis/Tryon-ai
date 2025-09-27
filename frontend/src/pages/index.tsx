import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <p>Sed ut perspiciatis unde omnis iste natus error</p>
      <Link href="/tryon" className="rounded-xl bg-blue-400 px-12 py-4 hover:bg-blue-700 hover:scale-105 transition-all text-white text-2xl font-bold">
      Try Now
      </Link>
    </div>
  );
}