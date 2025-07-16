import React from "react";

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
];

export default function OrbitAvatars() {
  const radius = 280;
  const centerX = 350;
  const centerY = 320;

  return (
    <div className="relative w-full h-[500px] flex justify-center items-center -mt-16">
      <div className="relative w-[700px] h-[400px]">
        {avatars.map((src, i) => {
          const angle = (Math.PI * (i / (avatars.length - 1))); // spread in half-circle
          const x = centerX + radius * Math.cos(angle) - 28;
          const y = centerY + radius * Math.sin(angle) - 28;
          return (
            <img
              key={i}
              src={src}
              alt={`Avatar ${i}`}
              className="absolute w-14 h-14 rounded-full border-4 border-white shadow-md"
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
