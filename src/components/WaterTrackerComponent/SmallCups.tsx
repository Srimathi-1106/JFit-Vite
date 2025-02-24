import React from 'react';
import Cup from './Cup'
import '../../css_files/SmallCups.css'

function SmallCups({ goal, handleChange }) {
  const cups = [];

  for (let i = 0; i < goal; i++) {
    cups.push(<Cup key={i} change={handleChange} />)
  }

  return (
    <div className="cups">
      {cups}
    </div>
  );
}


export default SmallCups;
