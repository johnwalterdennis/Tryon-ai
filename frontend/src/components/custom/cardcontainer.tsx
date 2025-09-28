import { useEffect, useState } from "react";
import axios from "axios";

type Outfit = {
  price: number;
  thumbnail_url: string;
  vendor: string;
  description: string;
};

type Property = {
  selectedOutfitID: string | undefined;
  setSelectedOutfitID: (outfitID: string | undefined) => void;
};

type OutfitsResponse = Record<string, Outfit>;

export default function CardContainer({selectedOutfitID, setSelectedOutfitID} : Property) {
  const [outfits, setOutfits] = useState<OutfitsResponse>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await axios.get<OutfitsResponse>(
          "http://localhost:8000/get-premade-outfit-details"
        );
        setOutfits(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail ?? err.message);
        } else {
          setError("Unexpected error while fetching outfits");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  if (isLoading) return <div>Loading outfits…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  function clickCard(outfitID : string) {
    setSelectedOutfitID(outfitID)
  }

  return (
    <div className="flex flex-col gap-4 h-[85%] overflow-scroll shadow-inner bg-darkpink/20 p-4 rounded-2xl">
      {Object.entries(outfits).map(([key, outfit]) => (
        <button
          key={key}
          className={`${key===selectedOutfitID ? "border-darkpink/50 border-[1px] !bg-lightpink" : ""} rounded-xl bg-white p-4 shadow flex gap-6 hover:scale-[1.02] transition-all cursor-pointer`}
          onClick={()=>clickCard(key)}
        >
          <img
            src={`${outfit.thumbnail_url}`}
            alt={outfit.description}
            className="h-48 aspect-square rounded-lg object-contain"
          />
          <div className="flex flex-col">
            <h3 className="mt-4 text-left text-lg font-semibold">{outfit.vendor}</h3>
            <p className="mt-2 text-left text-sm">{outfit.description}</p>
            <p className="mt-3 text-left text-gray-500 font-sans">${outfit.price}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
