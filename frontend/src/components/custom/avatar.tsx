import { useState, useEffect } from "react";
import axios from "axios";

type Property = {
  selectedOutfitID: string | undefined;
};

export default function Avatar({selectedOutfitID} : Property) {
    const [avatar, setAvatar] = useState<string | undefined>(undefined);

    useEffect(()=>{
        async function fetchAvatar() {
            try {
                const result = await axios.get("http://localhost:8000/get-generated-outfit", {
                    params: { outfit: selectedOutfitID}
                });
                console.log(result)
            } catch {
                console.log("fail")
            }
        }

        fetchAvatar();
    }, [selectedOutfitID]);

    return(
        <div className="h-full">
            {
                !avatar ? <div className="flex w-full h-full justify-center items-center" ><div className="bg-darkpink/20 w-[32rem] h-[76.5%] aspect-square rounded-2xl"></div></div> : <img src="" alt="hi"/>
            }
        </div>
    )
}