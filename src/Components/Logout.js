import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { Typography } from '@material-ui/core';
import '../CSS/allcss.css';
require('dotenv').config()
const style = {
    textAlign: 'center',
    background: '#F7E3C9'
};

function Logout() {
    const onSuccess = () => {
        alert('You have been logged out !!');
        window.location.assign('/');
        localStorage.clear();
    };

    return (
        <div style={style}>
            <div style={{ background: 'transparent', marginTop: '40vh' }} />
            <Typography id='msg' style={{ color: 'black', fontFamily: 'ITC Charter', fontVariant: 'small-caps', fontWeight: '600' }}>Sure to logout ?</Typography>
            <div style={{ background: 'transparent', marginTop: '5vh' }} />
            <GoogleLogout
                clientId={process.env.REACT_APP_AUTH}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div >

    );
}

export default Logout;