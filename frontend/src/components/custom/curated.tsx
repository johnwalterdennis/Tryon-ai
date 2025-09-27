import CardContainer from "./cardcontainer";

type Property = {
  selectedOutfitID: string | undefined;
  setSelectedOutfitID: (outfitID: string | undefined) => void;
};

export default function Curated(props: Property) {
  const { selectedOutfitID, setSelectedOutfitID } = props;
  return (
    <div className="h-[90%]">
      <CardContainer
        selectedOutfitID={selectedOutfitID}
        setSelectedOutfitID={setSelectedOutfitID}
      />
      <div className="flex justify-center items-center mt-4">
        {selectedOutfitID && (
          <button className="bg-green w-full p-4 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all">
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}
