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

    fetchFunction(url, token){
        return fetch(url, {
             headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if(!response.ok){ throw new Error('Error: ' + response.status)}
            return response.json()
        })
        .catch(error => {
            console.error('Error: ' + error.message)
        })
    },

    // search spotify and fetch and format results
    async search(searchType, searchTerm){
        const accessToken = this.getAccessToken();
        return await  this.fetchFunction(`https://api.spotify.com/v1/search?q=${searchTerm}&type=${searchType}`, accessToken)
            .then(async JSONResponse => {
                let data;
                
                // NEED TO ADD ARTIST SEARCH TO IF STATEMENTS
                if (searchType === 'artist'){
                    data = await this.fetchFunction(`https://api.spotify.com/v1/artists/${JSONResponse.artists.items[0].id}/albums?include_groups=album&limit=50`, accessToken);
                    return data.items.map(album => {
                        return ({
                            id: album.id,
                            name: album.name ,
                            album: album.album_type,
                            artist: album.artists[0].name,
                            uri: album.uri
                        })
                    })
                   
                //    ?include_groups=album
                } else if(searchType === 'album') { 
                    data = await this.fetchFunction(`https://api.spotify.com/v1/albums/${JSONResponse.albums.items[0].id}`, accessToken);
                    return data.tracks.items.map(track => ({ 
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: data.name,
                        uri: track.uri
                    }))
                } else if(searchType === 'track'){
                    return JSONResponse.tracks.items.map(track => ({ 
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }))
                }
    
                return this.formatTracks(data);
            })
            .catch(error => new Error(error))
    },

    // Fetch user id, save playlist to user accont, then add tracks to the saved playlist
    savePlaylist(playlisURIs, playlistName){
        accessToken = this.getAccessToken();
        const urserID = this.fetchFunction('https://api.spotify.com/v1/me', accessToken)
        .then(jsonResponse => jsonResponse.href)
        .then(urlWithUserID => {
            //Create new playlist playlistName argument
            return fetch(`${urlWithUserID}/playlists/`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${accessToken}`
                },
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
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({uris: playlisURIs})
                })
            })
        })
    }

}

export default Spotify;