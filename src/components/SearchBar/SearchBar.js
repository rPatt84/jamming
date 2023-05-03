import './SearchBar.css';
import React from 'react';

import { SearchType } from '../SearchType/SearchType'

export class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            searchTrack: '',
            searchType: 'artist'
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.extractType = this.extractType.bind(this);
    }
    // Update component state upon input
    handleInput(e){
        this.setState({ searchTrack: e.target.value })
    }

    extractType(e){
        this.setState({ searchType: e.target.value })
    }

    // run search spotify function
    handleClick(){
        if(this.state.searchTrack !== '' && this.state.searchType !== ''){
            this.props.handleSearch(this.state.searchType, this.state.searchTrack);
        } else {
            document.getElementById('invalid').style.display = 'block';
            setTimeout(() => {
                document.getElementById('invalid').style.display = 'none';
            },1000);
        }
        
    }

    render(){
        return (
            <div id="search-container">
                <SearchType getSearchType={this.extractType}/>
                <p id="invalid">Enter Search Criteria</p>
                <input id="search-song" type="text" placeholder="Search Spotify" title="search for song, album or artist" onChange={this.handleInput} />
                <button id="submit" type="submit" onClick={this.handleClick}>Search</button>
            </div>
        )  
    }
    
}