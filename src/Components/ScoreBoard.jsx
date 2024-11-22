import React from "react";

export default function ScoreBoard( { score , logo ,title}){
    return(
    <div className="flex flex-col items-center mb-4  pt-4">
      {/* Logo and Score  */}
      <div className="flex items-center justify-between w-full px-4">
        {/* Left Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Anime Logo"
            className="max-w-none h-16 object-contain  rounded-md" // Adjust the size of the logo
          />
        </div>

        {/* Rightside Score */}
        <div className="text-xl font-bold text-white bg-gray-800 px-4 py-1 rounded-md shadow-glow">
          Score: <span style={score === 0 ? { color: 'red' } : { color: '#0099ff' }}>{score}</span>/16
        </div>
      </div>

      {/* Title*/}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 text-center">
        {title.toLocaleUpperCase()}
      </h1>
    </div>
    );
}