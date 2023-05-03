import './SearchType.css'
import React from 'react';

export class SearchType extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        this.props.getSearchType(e);
    }

    render() {
        return (
            <form>
                <figure id="type">
                    <figcaption>What do you wish to search for?</figcaption>
                    <div>
                        <input id="artist-select" type="radio" className="type-tab"  name="type-select" value="artist" onClick={this.handleClick} defaultChecked/>
                        <label htmlFor="artist-select">Artist</label>
                    </div>
                    <div>
                        <input id="album-select" type="radio" className="type-tab"  name="type-select" value="album" onClick={this.handleClick} />
                        <label htmlFor="album-select">Album</label>
                    </div>
                    <div>                    
                        <input id="track-select" type="radio" className="type-tab"  name="type-select" value="track" onClick={this.handleClick} />
                        <label htmlFor="track-select">Track</label>
                    </div>
                </figure>
            </form>
           
        )
    }
}