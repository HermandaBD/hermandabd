
export function Perfil({me}) {
    return <div className='font-bold'>
        <p>Nombre</p>
        <p>{me.username}</p>
        <br />
        <p>Email</p>
        <p>{me.email}</p>
    </div>

}
