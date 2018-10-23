import React, {Component} from 'react';
import LocationList from './LocationList';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Set state for all locations
            'venueLocations': [
                {
                    'name': "Milano Coffee Phan Van Hon",
                    'type': "Cafe",
                    'latitude': 10.8268153,
                    'longitude': 106.622989,
                    'streetAddress': "Tân Thới Nhất 1, Tân Thới Nhất, Quận 12, Hồ Chí Minh, Vietnam"
                },
                {
                    'name': "Lac Quang Church",
                    'type': "Church",
                    'latitude': 10.836523,
                    'longitude': 106.61629,
                    'streetAddress': "Tân Thới Nhất 1, Tân Thới Nhất, Quận 12, Hồ Chí Minh, Vietnam"
                },
                {
                    'name': "Dam Sen Park",
                    'type': "Theme Park",
                    'latitude': 10.765815,
                    'longitude': 106.639104,
                    'streetAddress': "Số 3 Hòa Bình, Phường 3, Quận 11, Hồ Chí Minh, Vietnam"
                },
                {
                    'name': "Cong an Phuong Ben Thanh",
                    'type': "Police Station",
                    'latitude': 10.771000,
                    'longitude': 106.694969,
                    'streetAddress': "76 Lê Lai, Phường Bến Thành, Quận 1, Hồ Chí Minh 700000, Vietnam"
                },
                {
                    'name': "Mẹ và Bé Hoàng Văn Thụ",
                    'type': "Baby Store",
                    'latitude': 10.80157,
                    'longitude': 106.673144,
                    'streetAddress': "198 Hoàng Văn Thụ, Phường 9, Phú Nhuận, Hồ Chí Minh, Vietnam"
                },
                {
                    'name': "SMS Tower",
                    'type': "Building",
                    'latitude': 10.8569497,
                    'longitude': 106.6320871,
                    'streetAddress': "8 Đường Lê Lợi, Tân Thới 3, Hóc Môn, Hồ Chí Minh 700000, Vietnam"
                },
                {
                    'name': "Gym Saigon Act",
                    'type': "College Gym",
                    'latitude': 10.832624,
                    'longitude': 106.637653,
                    'streetAddress': "Xuân Thới Thượng, 87/8p ấp Xuân Thới Đông 1, Xuân Thới Đông, Hóc Môn, Hồ Chí Minh 700000, Vietnam"
                },
                {
                    'name': "Cau Bui Huu Nghia",
                    'type': "Bridge",
                    'latitude': 10.7941046,
                    'longitude': 106.7030425,
                    'streetAddress': "141 Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh 700000, Vietnam"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    // Mount Google Map
    componentDidMount() {
        window.initMap = this.initMap;
        loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyDMuPg-xp17jSEEjdxke-wpKNMmR24-MyY&v=3&callback=initMap')
    }

    // Initialize the map after Google Map API is loaded
    initMap() {
        const mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        const map = new window.google.maps.Map(mapview, {
            center: {lat: 10.826272, lng: 106.626023},
            zoom: 12,
            mapTypeControl: false
        });

        const InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick',  () => {
            this.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", () => {
            const center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            this.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', () => {
            this.closeInfoWindow();
        });

        const venueLocations = [];
        this.state.venueLocations.forEach(location => {
            const longname = location.name + ' - ' + location.type;
            const marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', () => {
                this.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            venueLocations.push(location);
        });
        this.setState({
            'venueLocations': venueLocations
        });
    }

    openInfoWindow(venue) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, venue);
        venue.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': venue
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(venue.getPosition());
        this.state.map.panBy(0, -200);
        this.state.map.panTo(venue.getPosition());
        this.state.map.setZoom(14);
        this.getVenues(venue);
    }


    //Retrieve the location data from foursquare api for the marker to display it in the infowindow
    getVenues = marker => {
        const clientId = "4ATSMFQDONZ5VLDPFPH4YR1ODXDHGL2VFZZZRE1T2BQEYDPL";
        const clientSecret = "AVPVOVT4SAAXDDZNGRVI0LZUPBFZ1DASYISP1ONNLB5JBF50";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20170815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                response => {
                    if (response.status !== 200) {
                        this.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(data => {
                        const location_data = data.response.venues[0]
                        console.log(location_data)
                        const name = `<b>Name: </b> ${location_data.name}<br>`
                        const category = `<b>Category: </b> ${location_data.categories[0].name}<br>`
                        const checkins = `<b>Number of CheckIn: </b> ${location_data.stats.checkinsCount}<br>`
                        const readMore = `<a href="https://foursquare.com/v/${location_data.id}' target='_blank'>Read More</a>`
                        this.state.infowindow.setContent(name + category + checkins + readMore);
                    });
                }
            )
            .catch(err => {
                this.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <div>
                <LocationList
                    key="100"
                    venueLocations={this.state.venueLocations}
                    openInfoWindow={this.openInfoWindow}
                    closeInfoWindow={this.closeInfoWindow}/>
                <div id="map">
                </div>
            </div>
        );
    }
}

export default App;

// Loads the google map api script
const loadScript = url => {
    // Get the first  script tag of the page
    let index  = window.document.getElementsByTagName("script")[0]

    // Create our script tag
    let script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true

    // Add our script before the first script tag
    index.parentNode.insertBefore(script, index)
    script.onerror = function() {
        alert("Error loading map! Check the URL!");
    };
}