import React, { useEffect, useState } from 'react'
import { getMeLogin } from "../api/auth.api";
import { Perfil } from "../components/auth/Perfil";
import { getHermandad } from '../api/hermandad.api';
export function MePage() {
    const [me, setMe] = useState([]);
    const [hermandad, setHermandad] = useState(localStorage.getItem('hermandad_usuario'));
    useEffect(() => {
        async function getMe() {
            const res = await getMeLogin();
            setMe(res);
            const h = localStorage.getItem('hermandad_usuario');
            const herman = await getHermandad(h);
            setHermandad(herman.data);
        }
        getMe();
    },[]);
    return <div className='max-w-xl mx-auto my-5'>
        {
            <Perfil me={me} hermandad={hermandad} />
        }
    </div>;

}