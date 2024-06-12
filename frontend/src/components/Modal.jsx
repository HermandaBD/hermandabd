import React from 'react';

export const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full relative border-black border">
                <button onClick={onClose} className="absolute top-2 right-2 py-0 px-2 rounded-full bg-gray-500 text-white hover:text-gray-300">
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

