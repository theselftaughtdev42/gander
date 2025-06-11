import React from 'react';
import './HighlightedName.css';


const HighlightedName = ({ name, highlightedText }) => {
  if (!highlightedText) return name;

  const regex = new RegExp(`(${highlightedText})`, 'i');
  console.log(regex)
  const parts = name.split(regex);

  return (
    <>
    <div>
      {parts.map((part, i) =>
        part.toLowerCase() === highlightedText.toLowerCase() ? (
          <span key={i} className="highlighted" >{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
    </>
  );
};

export default HighlightedName
