import React from 'react';

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
            try {
                window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`; 
            } catch(error) {
                console.log('Error:' + error)
            }
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
        .catch(error => new Error(error))
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

export default Spotify;