import React, { useEffect, useState } from 'react'
import { getUsers } from '../api/auth.api'

export function Usuarios() {
    const [users, setUsers] = useState([]);
    useEffect(()=> {
        async function getUsuarios() {
            const response = await getUsers();
            setUsers(response.data);
        }
        getUsuarios();
    }, []);
    return (
        <div>
            {users.map(user => (
                <p key={user.id}>{user.username} <br/> </p>
            ))}
        </div>
    )
}
