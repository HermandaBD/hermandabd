import React from 'react';

function FeatureCard({ title }) {
  const icons = {
    "Único": <img src='../utils/unique.png' className="w-12 h-12 mb-2" />,
    "En la nube": <img src='../utils/cloud.png' className="w-12 h-12 mb-2" />,
    "Cambios rápidos": <img src='../utils/changes.png' className="w-12 h-12 mb-2" />,
  };

  return (
    <div className="bg-orange-100 text-red-500 p-4 rounded shadow-md flex flex-col items-center">
      {icons[title]}
      <span className="text-2xl mb-2">{title}</span>
    </div>
  );
}

export default FeatureCard;
