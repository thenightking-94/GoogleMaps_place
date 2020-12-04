import React, { useState, useEffect } from 'react';
import '../CSS/allcss.css';
import { Avatar, Divider, Typography } from '@material-ui/core';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';

function Map() {
    return (
        <GoogleMap defaultZoom={7}
            defaultCenter={{ lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }} />
    )
}
//rendering the map component as a seperate component
const WrappedMap = withScriptjs(withGoogleMap(Map));

function Dashboard(props) {

    const [data, setdata] = useState([])
    const [LAT, setlat] = useState(null);
    const [LNG, setlng] = useState(null);
    let placeName = "Gujarat";

    useEffect(() => {
        let mydata = fetch('/artivatic.json',
            {
                method: 'GET', headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        mydata.then(res => res.json()).then(json => setdata(json.states));


        //using place Name to find out the lat and longitudes
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
        googleMapScript.async = true;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", () => {
            getLatLng();
        });
    }, []);

    const getLatLng = () => {
        var lat, lng, placeId;
        //using Geocoder API to calculate the lat and longitudes from any place name
        new window.google.maps.Geocoder().geocode(
            { address: placeName },
            function (results, status) {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    placeId = results[0].place_id;
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    setlat(Number(lat));
                    setlng(Number(lng));
                }
            }
        );
    };

    useEffect(() => {
        console.log(data)
        console.log(LAT);
        console.log(LNG);
        if (LAT)
            localStorage.setItem('lat', LAT);
        if (LNG)
            localStorage.setItem('lng', LNG);

        //storing the lat and longs in local storage
    }, [data, LAT, LNG])


    const logout_option = () => {
        window.location.assign('/logout');
    }
    return (
        <div>
            <div id='nav'>

                {window.innerWidth > 768
                    && <div><Typography className='typo'><i style={{ color: 'white' }}>{props.match.params.name}</i>&nbsp;</Typography>
                        <p style={{ fontFamily: 'ITC Charter', color: 'white' }}>{localStorage.getItem('email_id')}</p></div>
                }
                {window.innerWidth < 768 &&
                    <div><Typography className='typo'><i style={{ color: 'white' }}>{props.match.params.name}</i>&nbsp;</Typography>
                        <p style={{ fontFamily: 'Helvetica', fontSize: '16px !important', color: 'white' }}>{localStorage.getItem('email_id')}</p></div>
                }
                <Avatar onClick={logout_option} style={{ cursor: 'pointer' }} src={`${localStorage.getItem('img_url')}`} />
            </div>

            <Divider style={{ height: '150px', background: 'transparent' }} />




            <div style={{ width: "500px", height: "500px" }}>
                <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY
                    }`}
                    loadingElement={<div style={{ height: `500px`, width: '500px' }} />}
                    containerElement={<div style={{ height: `500px`, width: `500px` }} />}
                    mapElement={<div style={{ height: `500px`, width: `500px` }} />} />
            </div>

        </div>
    );


}

export default Dashboard;