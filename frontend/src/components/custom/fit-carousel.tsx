const outfitImages = [
  "/landing-page/1.png",
  "/landing-page/2.jpeg",
  "/landing-page/3.jpeg",
  "/landing-page/4.jpeg",
  "/landing-page/5.jpeg",
];
export default function FitCarousel() {
  return (
    <div className="absolute -z-10 flex gap-6 justify-center items-center overflow-hidden">
      <img src={outfitImages[1]} className="w-[15%] rounded-xl" />
      <img src={outfitImages[2]} className="w-[20%] rounded-xl" />
      <img src={outfitImages[0]} className="w-[22.5%] rounded-xl" />
      <img src={outfitImages[3]} className="w-[20%] rounded-xl" />
      <img src={outfitImages[4]} className="w-[15%] rounded-xl" />
    </div>
  );
}
