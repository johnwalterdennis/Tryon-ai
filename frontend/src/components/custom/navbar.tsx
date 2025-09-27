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
        <div className="absolute top-0 flex justify-between w-full px-12 py-4 border-b-[2px] border-b-darkpink/10">
            <div className="flex gap-10 font-medium items-center">
                <Image className="w-10" src={"/landing-page/logo.svg"} alt={"logo"} width={800} height={800}/>
                {items.map((item, i) => {
                    return (<p key={i}>{item}</p>)
                })}
            </div>
            <div className="flex items-center gap-10 font-medium">
                <p>Log in</p>
                <button className="bg-black py-3 px-4 text-white rounded-lg font-semibold">Get started for free</button>
            </div>
        </div>
    )
}