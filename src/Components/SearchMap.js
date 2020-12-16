import React, { useState, useEffect } from 'react';
import '../CSS/allcss.css';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import Loader from 'react-loader-spinner';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

//seperate map component as a custom hook
function Map() {
    return (
        <GoogleMap defaultZoom={5}
            defaultCenter={{ lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }} >
            <Marker position={{ lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }} />
        </GoogleMap>
    )
}
//rendering the map component as a seperate custom hook component
const WrappedMap = withScriptjs(withGoogleMap(Map));

//main method for rendering component
function SearchMap(props) {
    const [hover_on, sethover] = useState(false);
    const [renderMap, setrender] = useState(false);


    const InitialsMobile = (str) => {
        let res = '', val = '';
        str += ' ';
        for (var i = 0; i < str.length; i++) {
            if (str[i] != ' ')
                res += str[i];
            else {
                val += res[0];
                res = '';
            }


        }
        return val;
    }

    useEffect(() => {

        //using place Name to find out the lat and longitudes
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
        googleMapScript.async = true;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", () => {
            getlang();
        });
    }, []);

    const getlang = () => {
        let lat, lng, placeId;
        //using Geocoder API to calculate the lat and longitudes from any place name
        new window.google.maps.Geocoder().geocode(
            { address: `${props.match.params.word}` },
            function (results, status) {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    placeId = results[0].place_id;
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    localStorage.setItem('lat', lat);
                    localStorage.setItem('lng', lng);
                    setrender(true)
                }
            }
        );
    }

    const logout_option = () => {
        window.location.assign('/logout');
    }
    return (
        <div className='flexAdder' id='white_back'>
            <div id='nav'>
                <div className="home_back">
                    <ArrowBackIcon style={{ color: 'white', cursor: 'pointer' }} onClick={() => {
                        window.location.assign('/');
                    }} />
                </div>
                &nbsp;&nbsp;
                <p id="searched_word">Search Results ....</p>
                &nbsp;&nbsp;
                <div id='logged_info'>
                    {window.innerWidth > `${760}` && <Typography className='typo'><i style={{ color: 'black' }}>{localStorage.getItem('name_user')}</i></Typography>}
                    &nbsp;&nbsp;
                    {hover_on && window.innerWidth > `${760}` && <Typography style={{ background: 'red' }} className='logged_info'>Log out</Typography>}
                    {!hover_on && window.innerWidth > `${760}` && <Typography className='logged_info'>Logged in</Typography>}
                    &nbsp;&nbsp;
                    {window.innerWidth > `${760}` && <Avatar onMouseOver={() => { sethover(true) }} onMouseLeave={() => { sethover(false) }} onClick={logout_option} style={{ cursor: 'pointer' }} src={`${localStorage.getItem('img_url')}`} />}
                    {window.innerWidth < `${760}` && <Avatar onClick={logout_option} style={{ cursor: 'pointer', background: 'green' }} >{InitialsMobile(localStorage.getItem('name_user'))}</Avatar>}
                </div>

            </div>

            {
                props.match.params.word && !renderMap &&
                < Grid className={window.innerWidth > 768 ? 'maps' : 'map_Grid_mobile'} style={{ width: "95%", height: "95%", textAlign: 'center', marginTop: '20%' }}>
                    <Loader type="Bars" color={window.innerWidth > 768 ? "#e88d14" : 'white'} height={80} width={80} />
                </ Grid>
            }
            { props.match.params.word && renderMap &&
                < Grid className={window.innerWidth > 768 ? 'maps' : 'map_Grid_mobile'} style={{ width: "95%", height: "95%", textAlign: 'center' }}>
                    {
                        props.match.params.word && renderMap &&
                        <Typography id='current_view_search'>You searched for :&nbsp;&nbsp;{props.match.params.word}</Typography>
                    }
                    {
                        WrappedMap &&
                        <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY
                            }`}
                            loadingElement={<div style={{ height: `100%`, width: '100%' }} />}
                            containerElement={<div style={{ height: `80%`, width: `100%` }} />}
                            mapElement={<div style={{ height: `100%`, width: `100%`, borderRadius: '20px' }} />} />
                    }

                </Grid>
            }

            <span style={{ position: 'fixed', bottom: '2px', boxShadow: '5px 8px 10px #888', fontVariant: 'small-caps', color: 'white', width: '100%', background: 'black', height: '20px', textAlign: 'center' }} >© Shubham Chatterjee</span>
        </div >
    );


}

export default SearchMap;