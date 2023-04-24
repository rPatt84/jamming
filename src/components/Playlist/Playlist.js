import './Playlist.css';

import React from 'react';
import { Tracklist } from '../Tracklist/Tracklist';


export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    //update playlist name onchange
    handleNameChange(e){
        this.props.handleChange(e.target.value);
    }

    render(){
       return (
        <div className="result-list">
            <input  
                id="playlist-name" 
                className="list-title" 
                type="text" 
                title="Click to change playlist name"
                onChange={this.handleNameChange} 
                value={this.props.playlistName}
            />
            <Tracklist 
                tracks={this.props.playlistTracks} 
                handleClick={this.props.handleClick} 
                isRemoval={true}
            />
            <button id="save-btn" onClick={this.props.handlePlaylistSave}>Save To Spotify</button>
        </div>
    ) 
    }
    
}