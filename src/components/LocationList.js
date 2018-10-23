import React, {Component} from 'react';
import LocationItem from './LocationItem';

class LocationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
            'suggestions': true,
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

     // Filter locations based on user's search query
    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        let locations = [];
        this.props.venueLocations.forEach(location => {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'locations': locations,
            'query': value
        });
    }

    componentWillMount() {
        this.setState({
            'locations': this.props.venueLocations
        });
    }

    // Show and hide suggestions
    toggleSuggestions() {
        let btn = document.querySelector('button')
        let ul = document.querySelector('ul')
        let inputBox = document.querySelector('.search-field')
        if (!this.state.suggestions) {
            btn.innerHTML = 'Hide Locations'
            ul.style.display = 'block'
            inputBox.style.display = 'inline-block'
        } else {
            btn.innerHTML = 'Show Locations'
            ul.style.display = 'none';
            inputBox.style.display = 'none'
        }
        this.setState({
            'suggestions': !this.state.suggestions
        });
    }

    render() {
        const locationList = this.state.locations.map((listItem, index) => {
            return (
                <LocationItem
                    key={index}
                    openInfoWindow={this.props.openInfoWindow.bind(this)}
                    data={listItem}
                />
            );
        });

        return (
            <div className="search-container">
                <div className="searchBar">
                    <h2>Saigon|Vietnam</h2>
                    <input
                        role="search"
                        aria-labelledby="filter"
                        id="search-field"
                        className="search-field"
                        type="text"
                        placeholder="Filter Location"
                        value={this.state.query}
                        onChange={this.filterLocations}/>
                    <ul>
                        {this.state.suggestions && locationList}
                    </ul>
                    <button
                        className="button"
                        onClick={this.toggleSuggestions}>
                        Hide Locations
                    </button>
                </div>
            </div>
        );
    }
}

export default LocationList;