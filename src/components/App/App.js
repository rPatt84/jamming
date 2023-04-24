import './App.css';
import React from 'react';

// Import Components
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../utl/Spotify/Spotify';

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
        if(results.length >= 1){
          this.setState({
            searchResults: results
          })
        }
      })
      .catch(error => {
        console.log('Error:' + error)
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

export default App;
