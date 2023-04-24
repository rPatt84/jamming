import React from 'react';
import { Track } from '../Track/Track';
import './Tracklist.css';

export function Tracklist({tracks, handleClick, isRemoval}) {
    return (
        <div className="Tracklist">
            {tracks.map((track, i) => <Track  key={i} track={track} handleClick={handleClick} isRemoval={isRemoval} />)}
        </div>
    )
}