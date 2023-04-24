import React from 'react';
import { Tracklist } from '../Tracklist/Tracklist';

export const SearchResults = ({searchResults, handleClick}) => {
    return (
        <div className="result-list">
            <h2 className="list-title">Results</h2>
            <Tracklist tracks={searchResults} isRemoval={false} handleClick={handleClick}/>
        </div>
    )
  }