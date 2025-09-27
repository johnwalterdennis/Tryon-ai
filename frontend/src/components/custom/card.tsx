import { useEffect, useState } from "react";
import axios from "axios";

type Outfit = {
  price: number;
  thumbnail_url: string;
  vendor: string;
  description: string;
};

type OutfitsResponse = Record<string, Outfit>;

export default function Card() {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(outfits).map(([key, outfit]) => (
        <article key={key} className="rounded-xl border bg-white p-6 shadow">
          <img
            src={`http://localhost:8000${outfit.thumbnail_url}`}
            alt={outfit.description}
            className="h-48 w-full rounded-lg object-cover"
          />
          <h3 className="mt-4 text-lg font-semibold">{outfit.vendor}</h3>
          <p className="mt-2 text-sm text-gray-600">{outfit.description}</p>
          <p className="mt-3 font-bold">${outfit.price}</p>
        </article>
      ))}
    </div>
  );
}
