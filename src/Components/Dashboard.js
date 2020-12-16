import React, { useState, useEffect } from 'react';
import '../CSS/allcss.css';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { GoogleMap, withGoogleMap, withScriptjs, Marker } from 'react-google-maps';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Loader from 'react-loader-spinner';
import HomeIcon from '@material-ui/icons/Home';

//seperate map component as a custom hook
function Map() {
    return (
        <GoogleMap defaultZoom={10}
            defaultCenter={{ lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }} >
            <Marker position={{ lat: Number(localStorage.getItem('lat')), lng: Number(localStorage.getItem('lng')) }} />
        </GoogleMap>
    )
}
//rendering the map component as a seperate custom hook component
const WrappedMap = withScriptjs(withGoogleMap(Map));

//main method for rendering component
function Dashboard(props) {
    const [hover_on, sethover] = useState(false);
    const [data, setdata] = useState([]);
    const [dismaps, setdismaps] = useState([]);
    const [LAT, setlat] = useState(null);
    const [LNG, setlng] = useState(null);
    const [showcities, setshowcities] = useState(true);
    const [placeName, setplaceName] = useState(null);
    const [force, setforce] = useState(null);
    const [mobile, setmobile] = useState(false);

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


        //using place Name to find out the lat and longitudes
        if ((force === 'filled_with_new_district' && placeName) || (force === 'filled_with_new_city' && placeName)) {
            const googleMapScript = document.createElement("script");
            googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places`;
            googleMapScript.async = true;
            window.document.body.appendChild(googleMapScript);
            googleMapScript.addEventListener("load", () => {
                getlang();
            });
        }
        //updating local storage values for the updated-rendered map after getting updated data for lat & long
        if (force === 'got_new_data_for_new_map' && LAT && LNG && placeName) {
            localStorage.setItem('lat', LAT);
            localStorage.setItem('lng', LNG);
        }

    }, [LAT, LNG, placeName, force])

    const pickCityGetDistrict = (str) => {
        if (window.innerWidth > 768) {
            setforce('filled_with_new_city');
            setplaceName(str);
        }
        if (mobile)
            setmobile(false);

        setshowcities(false);
        var res = str, district = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].state === res) {
                    district = [...district, ...data[i].districts];
                }
            }
        }
        if (district) {
            district.sort((a, b) => { return (a.length - b.length) })
            setdismaps(district);
        }

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
                    //exclusive for mobile
                    if (window.innerWidth < 768)
                        setmobile(true)
                }
            }
        );
    }

    const logout_option = () => {
        window.location.assign('/logout');
    }
    return (
        <div style={{ position: 'relative' }}>
            <div id='nav'>
                <div className="home_back">
                    <HomeIcon style={{ color: 'white', cursor: 'pointer' }} onClick={() => {
                        window.location.assign('/');
                    }} />
                </div>
                &nbsp;&nbsp;
                <form className='form_search'>
                    <input className='searchBox' type='text' placeholder='Search for Places....' />
                </form>
                &nbsp;&nbsp;
                {data &&
                    <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: window.innerWidth > 768 ? '-150px' : '0' }}>
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

                <div id='logged_info'>
                    {window.innerWidth > `${760}` && <Typography className='typo'><i style={{ color: 'black' }}>{props.match.params.name}</i></Typography>}
                    &nbsp;&nbsp;
                    {hover_on && window.innerWidth > `${760}` && <Typography style={{ background: 'red' }} className='logged_info'>Log out</Typography>}
                    {!hover_on && window.innerWidth > `${760}` && <Typography className='logged_info'>Logged in</Typography>}
                    &nbsp;&nbsp;
                    {window.innerWidth > `${760}` && <Avatar onMouseOver={() => { sethover(true) }} onMouseLeave={() => { sethover(false) }} onClick={logout_option} style={{ cursor: 'pointer' }} src={`${localStorage.getItem('img_url')}`} />}
                    {window.innerWidth < `${760}` && <Avatar onClick={logout_option} style={{ cursor: 'pointer', background: 'green' }} >{InitialsMobile(props.match.params.name)}</Avatar>}
                </div>

            </div>
            <div className='bgimage'>
            </div>
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
                dismaps.length && !showcities && !mobile &&
                <Grid container className='district_grid' style={{ textAlign: 'center' }}>
                    {dismaps.map(item =>
                        <Grid key={item} item sm={6} md={6} xs={6} style={{ textAlign: '-webkit-center' }}>
                            <Typography onClick={() => {
                                setplaceName(item);
                                setforce('filled_with_new_district');
                                if (window.innerWidth < 768)
                                    setmobile(true);
                            }} className='typo_districts'>{item}</Typography>
                            <br /><br />
                        </Grid>)}
                </Grid>
            }

            {
                placeName && !showcities && force !== 'got_new_data_for_new_map' && LAT && LNG && ((window.innerWidth < 768 && mobile) || (window.innerWidth > 768)) &&
                < Grid className={window.innerWidth > 768 ? 'map_Grid' : 'map_Grid_mobile'} style={{ width: "95%", height: "95%", textAlign: 'center', marginTop: '20%' }}>
                    <Loader type="Bars" color={window.innerWidth > 768 ? "#e88d14" : 'white'} height={80} width={80} />
                </ Grid>
            }
            { placeName && !showcities && force === 'got_new_data_for_new_map' && LAT && LNG && ((window.innerWidth < 768 && mobile) || (window.innerWidth > 768)) &&
                < Grid className={window.innerWidth > 768 ? 'map_Grid' : 'map_Grid_mobile'} style={{ width: "95%", height: "95%", textAlign: 'center' }}>
                    {
                        placeName && force === 'got_new_data_for_new_map' &&
                        <Typography id='current_view'>You are currently viewing :&nbsp;&nbsp;{placeName}</Typography>
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

export default Dashboard;