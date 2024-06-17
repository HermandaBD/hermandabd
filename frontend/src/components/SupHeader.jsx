import React from 'react'

export function SupHeader() {
    if (location.pathname == "/") {
        return (
            <div className="flex items-center bg-persian h-12">
                <span className="bg-persian text-white rounded-full xl:px-2 xl:py-1 xl:mr-2 border-white border-2 xl:ml-80">NUEVO</span>
                <span className='text-white  xl:ml-60'>COMENZANDO EL DESARROLLO INNOVADOR PARA LA GESTIÓN DE TU HERMANDAD!</span>
            </div>
        )
    } else {
        return (
            <></>
        )
    }

}

