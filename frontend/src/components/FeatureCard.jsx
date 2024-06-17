import React from 'react';

function FeatureCard({ title }) {
  const icons = {
    "Único": <img src='../utils/unique.png' className="w-20 h-20 mb-2" />,
    "En la nube": <img src='../utils/cloud.png' className="w-20 h-20 mb-2" />,
    "Cambios rápidos": <img src='../utils/changes.png' className="w-20 h-20 mb-2" />,
  };

  return (
    <div className="bg-sandy text-black font-bold p-4 rounded-3xl shadow-2xl flex flex-col items-center xl:mx-44 mt-6">
      {icons[title]}
      <span className="text-2xl mb-2">{title}</span>
    </div>
  );
}

export default FeatureCard;
