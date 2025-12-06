import React from 'react';

export default function Tabs({ categories, value, onChange }){
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3">
        {categories.map(c => (
          <button key={c} onClick={()=>onChange(c)} className={`py-2 px-4 rounded-full ${value===c? 'bg-blue-500 text-white' : 'bg-white text-gray-700 shadow'}`}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
