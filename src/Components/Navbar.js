import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        return (
            <div style={{display: 'flex'}}>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <h1 style={{marginTop: '1rem', marginLeft: '1rem'}}>Movies App</h1>
                </Link>
                <Link to="/favourites" style={{textDecoration: 'none'}}>
                    <h3 style={{marginTop: '1.5rem', marginLeft: '2rem'}}>Favorites</h3>
                </Link>
            </div>
        )
    }
}
