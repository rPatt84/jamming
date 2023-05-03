import React from 'react';
import { Track } from '../Track/Track';
import './Tracklist.css';

export function Tracklist({tracks, handleClick, isRemoval}) {
    return (
        <div className="tracklist">
            {tracks.map((track, i) => 
                <Track  
                    key={i} track={track} 
                    handleClick={handleClick} 
                    isRemoval={
                        isRemoval.length > 0 ? isRemoval[i] : isRemoval
                    } 
                />)}
        </div>
    )
}