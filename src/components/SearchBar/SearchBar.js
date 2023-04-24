import './SearchBar.css';
import React from 'react';

export class SearchBar extends React.Component{
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
        if(this.state.searchTrack !== ''){
            this.props.handleSearch(this.state.searchTrack);
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
                <p id="invalid">Enter Search Criteria</p>
                <input id="search-song" type="text" placeholder="Search Spotify" title="search for song, album or artist" onChange={this.handleInput} />
                <button id="submit" type="submit" onClick={this.handleClick}>Search</button>
            </div>
        )  
    }
    
}