import { useState, useEffect } from "react";

export default function Avatar() {
    const [avatar, setAvatar] = useState<string | undefined>(undefined);

    useEffect(()=>{
        //TODO: fetch avatar and update avatar state
    }, []);

    return(
        <div className="h-full">
            {
                !avatar ? <div className="flex w-full h-full justify-center items-center" ><div className="bg-darkpink/20 w-[32rem] h-[76.5%] aspect-square rounded-2xl"></div></div> : <img src="" alt="hi"/>
            }
        </div>
    )
}