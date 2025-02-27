import React from "react";
import Cup from "./Cup";
import "../../css_files/SmallCups.css";

function SmallCups({ goal, handleChange, selectedCups }) {
  return (
    <div className="cups">
      {Array.from({ length: goal }).map((_, i) => (
        <Cup key={i} index={i} change={handleChange} selected={selectedCups[i] || 0} />
      ))}
    </div>
  );
}

export default SmallCups;
