import { useState, useEffect } from "react";

export default function Avatar() {
    const [avatar, setAvatar] = useState<string | undefined>(undefined);

    useEffect(()=>{
        //TODO: fetch avatar and update avatar state
    }, []);

    return(
        <div>
            {
                !avatar ? <div></div> : <img src="" alt="hi"/>
            }
        </div>
    )
}