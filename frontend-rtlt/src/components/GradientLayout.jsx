import React from "react";

const GradientLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-900 via-white to-sky-900 px-6 relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute w-72 h-72 bg-blue-900 blur-3xl opacity-40 rounded-full top-[-100px] right-[-100px]" />
      <div className="absolute w-72 h-72 bg-purple-900 blur-3xl opacity-40 rounded-full bottom-[-120px] left-[-120px]" />

      {children}
    </div>
  );
};

export default GradientLayout;