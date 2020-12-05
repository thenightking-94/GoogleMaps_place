import React, { useState, useEffect } from 'react';
import '../CSS/allcss.css';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
//seperate map component as a custom hook
function Map() {
    return (
        <GoogleMap defaultZoom={8}
            defaultCenter={{ lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }} />
    )
}
//rendering the map component as a seperate custom hook component
const WrappedMap = withScriptjs(withGoogleMap(Map));
function Dashboard(props) {

    const [data, setdata] = useState([]);
    const [dismaps, setdismaps] = useState([]);
    const [LAT, setlat] = useState(null);
    const [LNG, setlng] = useState(null);
    const [showcities, setshowcities] = useState(true);
    const [placeName, setplaceName] = useState('india');
    const [force, setforce] = useState(null);

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
            getlang();
        });
    }, []);

    useEffect(() => {
        if (LAT && placeName)
            localStorage.setItem('lat', LAT);
        if (LNG && placeName)
            localStorage.setItem('lng', LNG);

        //using place Name to find out the lat and longitudes
        if ((force == 'filled_with_new_district' && placeName) || (force == 'filled_with_new_city' && placeName)) {
            const googleMapScript = document.createElement("script");
            googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
            googleMapScript.async = true;
            window.document.body.appendChild(googleMapScript);
            googleMapScript.addEventListener("load", () => {
                getlang();
            });
        }

    }, [LAT, LNG, placeName, force])

    const pickCityGetDistrict = (str) => {
        setforce('filled_with_new_city');
        setplaceName(str);
        setshowcities(false);
        var res = str, district = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].state == res) {
                    district = [...district, ...data[i].districts];
                }
            }
        }
        if (district)
            setdismaps(district);
    }
    const getlang = () => {
        let lat, lng, placeId;
        //using Geocoder API to calculate the lat and longitudes from any place name
        new window.google.maps.Geocoder().geocode(
            { address: `${placeName}` },
            function (results, status) {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    placeId = results[0].place_id;
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    setlat(Number(lat));
                    setlng(Number(lng));
                    setforce('got_new_data_for_new_map');
                }
            }
        );
    }

    const logout_option = () => {
        window.location.assign('/logout');
    }
    return (
        <div>
            <div id='nav'>

                {window.innerWidth > 768
                    && <div><Typography className='typo'><i style={{ color: 'black' }}>{props.match.params.name}</i>&nbsp;</Typography>
                        <p style={{ fontFamily: 'ITC Charter', color: 'black' }}>{localStorage.getItem('email_id')}</p></div>
                }
                {window.innerWidth < 768 &&
                    <div><Typography className='typo'><i style={{ color: 'black' }}>{props.match.params.name}</i>&nbsp;</Typography>
                        <p style={{ fontFamily: 'ITC Charter', fontSize: '16px !important', color: 'black' }}>{localStorage.getItem('email_id')}</p></div>
                }
                {data &&
                    <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <p onClick={() => {
                            if (!showcities)
                                setshowcities(true);
                            if (showcities)
                                setshowcities(false)
                        }} id='explore_typo'>
                            {window.innerWidth > 768 ? 'Choose to Explore' : 'Explore'}
                        </p>
                        {!showcities && <ArrowDropDownIcon />}
                        {showcities && <ArrowDropUpIcon />}


                    </span>
                }
                <Avatar onClick={logout_option} style={{ cursor: 'pointer' }} src={`${localStorage.getItem('img_url')}`} />
            </div>

            <div className='bgimage'>

                {data && showcities &&
                    <Grid className='states_grid' container style={{ textAlign: 'center' }}>
                        {data.map(item =>
                            <Grid key={item.state} item sm={3} md={3} xs={6}>
                                <Typography onClick={() => { pickCityGetDistrict(item.state) }} className='typo_states'>{item.state}</Typography>
                            </Grid>
                        )}
                    </Grid>
                }
                {
                    dismaps.length && !showcities &&
                    <Grid container className='district_grid' style={{ textAlign: 'center' }}>
                        {dismaps.map(item =>
                            <Grid key={item} item sm={6} md={6} xs={6}>
                                <Typography onClick={() => {
                                    setplaceName(item);
                                    setforce('filled_with_new_district');
                                }} className='typo_districts'>{item}</Typography>
                                <br /><br />
                            </Grid>)}
                    </Grid>
                }
            </div>

            {placeName && !showcities && force == 'got_new_data_for_new_map' &&
                < Grid className='map_Grid' style={{ width: "95%", height: "95%" }}>
                    <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY
                        }`}
                        loadingElement={<div style={{ height: `100%`, width: '100%' }} />}
                        containerElement={<div style={{ height: `100%`, width: `100%` }} />}
                        mapElement={<div style={{ height: `100%`, width: `100%` }} />} />
                </Grid>
            }




        </div >
    );


}

export default Dashboard;