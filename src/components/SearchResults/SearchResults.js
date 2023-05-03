import React from 'react';
import { Tracklist } from '../Tracklist/Tracklist';

export const SearchResults = ({searchResults, handleClick}) => {
    const removal = searchResults.map(entry => {
        if(entry.album === 'album'){ return 'no-add'};
        return false;
    });
    console.log(typeof removal)

    return (
        <div className="result-list">
            <h2 className="list-title">Results</h2>
            <Tracklist tracks={searchResults} isRemoval={removal} handleClick={handleClick}/>
        </div>
    )
  }