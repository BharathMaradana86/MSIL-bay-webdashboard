import React from 'react';
import "./LoadSpinner.css"; 

function LoadSpinner({height}) {
  return (
    <div className="spinner-container" style={{height:height}}>
      <div className="loading-spinner">
      </div>
    </div>
  )
}

export default LoadSpinner