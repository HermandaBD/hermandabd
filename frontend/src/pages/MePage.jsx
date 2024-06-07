import React, { useEffect, useState } from 'react'
import { getMeLogin } from "../api/auth.api";
import { Perfil } from "../components/auth/Perfil";
export function MePage() {
    const [me, setMe] = useState([]);
    useEffect(() => {
        async function getMe() {
            const res = await getMeLogin();
            console.log(res);
            setMe(res);
        }
        getMe();
    },[]);
    return <div className='max-w-xl mx-auto my-5'>
        {
            <Perfil me={me} />
        }
    </div>;

}