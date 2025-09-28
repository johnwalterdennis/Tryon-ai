import Image from "next/image"
const items = [
    "Products",
    "Solutions",
    "Community",
    "Resources",
    "Pricing"
]
export default function Navbar() {
    return(
        <div className="absolute top-0 flex justify-between w-full px-16 py-3 border-b-[2px] border-b-darkpink/10">
            <div className="flex gap-10 items-center text-sm">
                <Image className="w-10" src={"/landing-page/logo.svg"} alt={"logo"} width={800} height={800}/>
                {items.map((item, i) => (
                    <span key={i} className="flex items-center gap-1 cursor-pointer">
                        {item}
                        {item !== "Pricing" && (
                            <Image
                                src="/landing-page/dropdown.svg"
                                alt="Dropdown indicator"
                                width={20}
                                height={6}
                            />
                        )}
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
                <p className="border-1 rounded-lg py-3 px-4 cursor-pointer hover:scale-[1.02] transition-all">Log in</p>
                <button className="bg-black py-3 px-4 text-white rounded-lg font-semibold cursor-pointer hover:scale-[1.02] transition-all">Get started for free</button>
            </div>
        </div>
    )
}
