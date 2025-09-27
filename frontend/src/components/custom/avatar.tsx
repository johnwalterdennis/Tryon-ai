import { useState, useEffect } from "react";

export default function Avatar() {
    const [avatar, setAvatar] = useState<string | undefined>(undefined);

    useEffect(()=>{
        //TODO: fetch avatar and update avatar state
    }, []);

    return(
        <div>
            {
                !avatar ? <div className="bg-darkpink/20 w-48 h-48 rounded-2xl"></div> : <img src="" alt="hi"/>
            }
        </div>
    )
}