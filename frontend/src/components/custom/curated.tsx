import axios from "axios";
import CardContainer from "./cardcontainer";

export default function Curated() {
  return (
    <div className="h-[90%]">
      <CardContainer />
      <div className="flex justify-center items-center mt-4">
        <button className="bg-green w-full p-4 text-white rounded-2xl font-bold hover:scale-105 transition-all">Checkout</button>
      </div>
    </div>
  );
}
