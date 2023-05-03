import React from 'react';
import './Track.css';

export const Track = ({track, handleClick, isRemoval}) => {

    // Return track info on button press
    function returnTrackInfo(e){
       handleClick(track)
    }

    console.log(isRemoval)
  
    return (
      <div className="track">
          <div className="styling-cont">
              <h3>{track.name}</h3>
              <p>{track.album} <span className="span-divider">|</span> {track.artist}</p>
              {(isRemoval === 'no-add' ? <button className="hidden"></button> : <button className="add-remove-btn" onClick={returnTrackInfo}>{(!isRemoval && '+') || '-'}</button>)}
          </div>
          
      </div>
  
    )  
  }