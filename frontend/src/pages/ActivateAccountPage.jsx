import React, { useEffect, useState } from 'react'
import { activateAccount } from "../api/auth.api";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export function ActivateAccountPage() {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    useEffect(() => {
        async function activate(uid, token) {

            try {
                const success = await activateAccount(uid, token);
                if (success) {
                    setState("Success");
                } else {
                    setState("Error");
                }
                toast.success("Cuenta activada con éxito");
            } catch (error) {
                setState("Error");
                toast.error("Ocurrió un error al intentar activar la cuenta")
                throw error;
            } finally {
                setLoading(false);
            }
        }
        activate(params.uid, params.token);
    }, []);

    if (loading) return <div>Cargando...</div>

    if (state == "Success") return <div>Enhorabuena, su cuenta fue activada con éxito!
        inicie sesión
    </div>

    if (state == "Error") return <div>¡Vaya! Ocurrió un problema al activar su cuenta</div>

}
