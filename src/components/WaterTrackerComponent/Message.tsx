import React, { useRef, useEffect } from "react";
import "../../css_files/message.css";

interface MessageProps {
  currentValue: number;
  goal: number;
}

const Message: React.FC<MessageProps> = ({ currentValue, goal }) => {
  const remainedRef = useRef<HTMLDivElement | null>(null);
  const literRef = useRef<HTMLSpanElement | null>(null);

  const percentage = Math.floor((currentValue / goal) * 100) || 0; // Ensure a valid number

  useEffect(() => {
    if (!remainedRef.current || !literRef.current) return;

    if (currentValue === goal) {
      remainedRef.current.style.visibility = "hidden";
      remainedRef.current.style.height = "0px";
    } else {
      remainedRef.current.style.visibility = "visible";
      literRef.current.innerText = `${(250 * goal) / 1000 - (250 * currentValue) / 1000}L`;
    }
  }, [currentValue, goal]);

  let message = "";

  if (percentage > 0 && percentage <= 15) {
    message = "A fresh start!";
  } else if (percentage > 15 && percentage < 50) {
    message = "Remember your goal!";
  } else if (percentage === 50) {
    message = "Half way there!";
  } else if (percentage > 50 && percentage <= 99) {
    message = "Don't quit now!";
  } else if (percentage === 100) {
    message = "That's all! Hurray!";
  }

  return (
    <div className="message-wrapper">
      <div className="message">{message}</div>
      <div className="remained" ref={remainedRef}>
        <span ref={literRef}></span>
        <small>Remained</small>
      </div>
    </div>
  );
};

export default Message;
