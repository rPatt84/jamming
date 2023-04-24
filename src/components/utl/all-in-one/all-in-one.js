import React from 'react';


// Set url on load so access token can be extracted.
(function onload(){
  Spotify.getAccessToken();
})()


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: 'New Playlist'
    }

    // Bind methods to this
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
    this.handlePlaylistNameChange = this.handlePlaylistNameChange.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.searchBtn = this.searchBtn.bind(this);
  }

  // Add Track to playlist
  addToPlaylist(track){
    if(!this.state.playlistTracks.includes(track)){

      const removedAddedTrack = this.state.searchResults.filter(currentTrack => currentTrack !== track);

      this.setState({ 
        playlistTracks: [...this.state.playlistTracks, track],
        searchResults: removedAddedTrack
      })
    }
  }

  // Remove Tracks from playlist
  removeFromPlaylist(track){
    if(this.state.playlistTracks.includes(track)){
    
      const addedToSearchResults = [track, ...this.state.searchResults];
      const filteredPlaylist = this.state.playlistTracks.filter(currentTrack => currentTrack !== track);

      this.setState({ 
        playlistTracks: filteredPlaylist,
        searchResults: addedToSearchResults
      });
    }
  }

  // Change Playlist name in state
  handlePlaylistNameChange(newPlaylistName){
    this.setState({ playlistName: newPlaylistName})
  }

  // Clear playlist array
  resetPlaylistTracks(newPlaylist) {
    this.setState({ playlistTracks: newPlaylist})
  }

  // Save current playlist
  savePlaylist(){
    // Handle invalid entry
    if(this.state.playlistTracks.length === 0 && !this.state.playlistName) { console.log('Please name and add tracks to your playlist') };
    if(this.state.playlistTracks.length === 0 && this.state.playlistName) { console.log('Your playlist must contain at least one track') };
    if(this.state.playlistTracks.length >= 1 && !this.state.playlistName) { console.log('Please name your playlist') } ;

    // Handle valid entry
    if(this.state.playlistTracks.length >= 1 && this.state.playlistName){
      const playlistURIs = this.state.playlistTracks.map(track => track.uri);
      const playlistName = this.state.playlistName;

      // Save playlist
      Spotify.savePlaylist(playlistURIs, playlistName);

      this.resetPlaylistTracks([]);
      this.handlePlaylistNameChange('New Playlist');
    } 
  }

  // Search Spotify & get token if needed
  searchBtn(searchTerm){
    Spotify.search(searchTerm)
      .then(results => {
        if(results){
          this.setState({
            searchResults: results
          })
        }
      })
    }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Ja<span id="mmm">mmm</span>in</h1>
          <p>A Spotify Playlist Creator</p>
        </header>
        <section>
          <SearchBar 
            handleSearch={this.searchBtn}
          />
        </section>
        <section id="search-playlist-container">
          <SearchResults 
            searchResults={this.state.searchResults} 
            handleClick={this.addToPlaylist}
          />
          <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks} 
            handleClick={this.removeFromPlaylist}
            handleChange={this.handlePlaylistNameChange}
            handlePlaylistSave={this.savePlaylist}
          />
        </section>
      </div>
    );
  }
  
}

class SearchBar extends React.Component{
  constructor(props){
      super(props);
      this.state = { searchTrack: '' }
      this.handleInput = this.handleInput.bind(this);
      this.handleClick = this.handleClick.bind(this);
  }
  // Update component state upon input
  handleInput(e){
      this.setState({ searchTrack: e.target.value})
  }

  // run search spotify function
  handleClick(){
      this.props.handleSearch(this.state.searchTrack);
  }

  render(){
      return (
          <div id="search-container">
              <input id="search-song" type="text" placeholder="Search Spotify" title="search for song, album or artist" onChange={this.handleInput} />
              <button id="submit" type="submit" onClick={this.handleClick}>Search</button>
          </div>
      )  
  }
  
}

export const SearchResults = ({searchResults, handleClick}) => {
  return (
      <div className="result-list">
          <h2 className="list-title">Results</h2>
          <Tracklist tracks={searchResults} isRemoval={false} handleClick={handleClick}/>
      </div>
  )
}

function Tracklist({tracks, handleClick, isRemoval}) {
  return (
      <div className="Tracklist">
          {tracks.map((track, i) => <Track  key={i} track={track} handleClick={handleClick} isRemoval={isRemoval} />)}
      </div>
  )
}

export const Track = ({track, handleClick, isRemoval}) => {

  // Return track info on button press
  function returnTrackInfo(e){
     handleClick(track)
  }

  return (
    <div className="track">
        <div className="styling-cont">
            <h3>{track.name}</h3>
            <p>{track.album} <span className="span-divider">|</span> {track.artist}</p>
            <button className="add-remove-btn" onClick={returnTrackInfo}>{(!isRemoval && '+') || '-'}</button>
        </div>
        
    </div>

  )  
}

const clientID = '7c9bfaa670d649658b4a75a6d759ff13';
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {

    // Get URL with with access token, extract access token from url
    getAccessToken() {   
        if(accessToken){ return accessToken }
      
        let url = window.location.href.toString().split('#');
        url = url[1];
        const searchParams = new URLSearchParams(url);
        // if url conatins access token, extract token
        if(searchParams.has('access_token')){
            const expiresIn = Number(searchParams.get('expires_in'));

            accessToken = searchParams.get('access_token');
            
            setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('access_token', null, '/');

            return accessToken;
        } else {
            // If url doesnt contain access token set window url
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`; 
        }
    },

    // search spotify and fetch and format results
    search(searchTerm){
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if(response.ok){ return response.json() }
        })
        .then(JSONResponse => {
            if(!JSONResponse.tracks){ return false }
            return JSONResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
        .catch(error => console.log(error.message))
    },

    // Fetch user id, save playlist to user accont, then add tracks to the saved playlist
    savePlaylist(playlisURIs, playlistName){
        const headers = { 'Authorization': `Bearer ${accessToken}`}

        // Fetch User ID and get url conatining user id
        const userID = fetch('https://api.spotify.com/v1/me', {
            headers: headers
        })
        .then(response => {
            if(response.ok){ return response.json() }
            throw new Error('Error: ' + response.status);
        })
        .then(jsonResponse => jsonResponse.href)
        .then(urlWithUserID => {
            //Create new playlist playlistName argument
            return fetch(`${urlWithUserID}/playlists/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: playlistName})
            })
            .then(response => {
                if(response.ok){ return response.json() }
                throw new Error('Error:' + response.status)
            })
            .then(jsonResponse => {
                // Add tracks to the saved playlist
                return fetch(`${urlWithUserID}/playlists/${jsonResponse.id}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({uris: playlisURIs})
                })
            })
        })
    }

}
