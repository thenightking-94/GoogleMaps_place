import React, { useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from './RefreshToken';
import { Typography } from '@material-ui/core';
import '../CSS/allcss.css';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Store } from '../index';
require('dotenv').config()

const style = {
    textAlign: 'center',
    background: '#F7E3C9'
};

function Login() {
    const Name = useSelector(state => state.name);
    const Img = useSelector(state => state.img);
    const Email = useSelector(state => state.email);
    const dispatch = useDispatch();

    const onSuccess = (response) => {
        var profile = response.getBasicProfile();
        dispatch({ type: 'LOGGEDIN', email: profile.getEmail(), name: profile.getName(), img: profile.getImageUrl() });
        console.log(Store.getState())
        refreshTokenSetup(response);
    };

    useEffect(() => {
        localStorage.setItem('img_url', Img);
        localStorage.setItem('email_id', Email);
        localStorage.setItem('name_user', Name);
    }, [Name, Img, Email])

    const onFailure = (response) => {
        alert('Login failed !! Please check your credentials')
    };

    return (
        <div style={style}>
            <div style={{ background: 'transparent', marginTop: '40vh' }} />
            <Typography id='msg' style={{ color: 'black', fontFamily: 'ITC Charter', fontVariant: 'small-caps', fontWeight: '600' }}>Hey ! Login to Explore with us</Typography>
            <div style={{ background: 'transparent', marginTop: '5vh' }} />
            <GoogleLogin
                className='signInButton'
                clientId={process.env.REACT_APP_AUTH}
                buttonText='Login in with Google'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
            {
                Name &&
                <Redirect to={`/dashboard/${Name}`} />
            }
        </div >

    );
}

export default Login;
