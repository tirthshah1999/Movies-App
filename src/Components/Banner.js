import React, { Component } from 'react';
import { movies } from '../../../movies-app/src/Components/getMovies';

export default class Banner extends Component {
    render() {
        let movie = movies.results;
        return (
            <>
              {
                  movie === '' ? 
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div> : 

                    <div className="card banner-card">
                        <img src={`https://image.tmdb.org/t/p/original${movie[0].backdrop_path}`}  alt={movie.title} className="card-img-top banner-img"/>
                        <div className="card-body">
                            <h5 className="card-title banner-title">{movie[0].original_title}</h5>
                            <p className="card-text banner-text">{movie[0].overview}</p>
                        </div>
                    </div>
                    
              }  
            </>
        )
    }
}
