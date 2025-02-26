// import React, { useState } from "react";
// import '../../css_files/Cup.css'

// function Cup(props) {
//   const [count, setCount] = useState(0);
 
//   function highlightCups() {
//     if (count === 0) {
//       setCount(1)
//       props.change(1)
//     } else {
//       setCount(0)
//       props.change(-1)
//     }
//   }
//   return (
//     <div className={`cup cup-small ${count ? 'full' : ''}`} onClick={highlightCups}>
//       250 ml
//     </div>
//   )
// }


// export default Cup;
import React, { useState, useEffect } from "react";
import '../../css_files/Cup.css'
 
function Cup(props) {
  const [count, setCount] = useState(0);
 
  useEffect(() => {
    const savedState = localStorage.getItem('selectedCups');
    if (savedState) {
      const selectedCups = JSON.parse(savedState);
      setCount(selectedCups[props.index] || 0);
    }
  }, [props.index]);
 
 
  function highlightCups(e) {
    const newCount = count === 0 ? 1 : 0;
    setCount(newCount);
    props.change(newCount ? 1 : -1);
 
    const savedState = JSON.parse(localStorage.getItem('selectedCups')) || [];
    savedState[props.index] = newCount;
    localStorage.setItem('selectedCups', JSON.stringify(savedState));
  }
 
  return (
    <div className={`cup cup-small ${count ? 'full' : ''}`} onClick={highlightCups}>
      250 ml
    </div>
  );
}
 
export default Cup;