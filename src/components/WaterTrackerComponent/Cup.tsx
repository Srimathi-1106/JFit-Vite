import React, { useState, useEffect } from "react";
import "../../css_files/Cup.css";

function Cup({ index, change, selected }) {
  const [isFull, setIsFull] = useState(selected === 1);

  useEffect(() => {
    setIsFull(selected === 1);
  }, [selected]);

  const highlightCups = () => {
    const newState = !isFull;
    setIsFull(newState);
    change(newState ? 1 : -1, index);
  };

  return (
    <div className={`cup cup-small ${isFull ? "full" : ""}`} onClick={highlightCups}>
      250 ml
    </div>
  );
}

export default Cup;
