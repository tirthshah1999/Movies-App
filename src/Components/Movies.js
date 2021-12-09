import React, { Component } from 'react'
// import { movies } from './getMovies';
import axios from 'axios';

export default class Movies extends Component {
    constructor(){
        super();
        this.state = {
            hover: '',
            parr: [1],
            currPage: 1,
            movies: [],
            favourites: []
        }
    }

    componentDidMount = async() => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=5540e483a20e0b20354dabc2d66a31c9&language=en-US&page=${this.state.currPage}`);

        const data = res.data;
        this.setState({
            movies: data.results
        })
        
        // while we route from fav to home; state loses so when we route to home we get data from local storage so that our fav data remains consitent
        this.handleFavouriteState();
    }

    changeMovies = async() => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=5540e483a20e0b20354dabc2d66a31c9&language=en-US&page=${this.state.currPage}`);

        const data = res.data;
        this.setState({
            movies: data.results
        })
    }
    
    handleNext = () => {
        let temp = [];
        for(let i = 1; i <= this.state.parr.length + 1; i++){
            temp.push(i);
        }
        // setState is async so have to pass changeMovies once state change
        this.setState({
            parr: [...temp],
            currPage: this.state.currPage + 1 
        }, this.changeMovies)
    }
    
    handlePrev = () => {
        if(this.state.currPage !== 1){
            this.setState({
                currPage: this.state.currPage - 1
            }, this.changeMovies)
        }
    }
    
    handleClick = (value) => {
        // It doesn't make sense to re-render that same page again which you are currently on
        if(this.state.currPage !== value){
            this.setState({
                currPage: value
            }, this.changeMovies)
        }
    }
    
    handleFavourites = (movieObj) => {
        let data = JSON.parse(localStorage.getItem("movies-app") || "[]");
        if(this.state.favourites.includes(movieObj.id)){  // remove from fav
            data = data.filter((movie) => movie.id !== movieObj.id)
        }else{
            data.push(movieObj);    // add to fav
        }

        localStorage.setItem("movies-app", JSON.stringify(data));
        this.handleFavouriteState();
    }

    handleFavouriteState = () => {
        let data = JSON.parse(localStorage.getItem("movies-app") || "[]");
        let movieId = data.map((movie) => movie.id);
        this.setState({
            favourites: [...movieId]
        })
    }
    
    render() {
        return (
            <>
              {
                  this.state.movies.length === 0 ?
                  <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                  </div> : 
                  <div>
                    <h3 className="text-center">Trending</h3>
                    <div className="movies-list">
                        {
                            this.state.movies.map((movieObj) => (
                                <div className="card movies-card" 
                                onMouseEnter={()=>this.setState({hover:movieObj.id})}
                                onMouseLeave={() => this.setState({hover: ''})}
                                >
                                    <img src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} alt={movieObj.title} className="movies-img" />
                                    <div className="card-body">
                                        <h5 className="card-title movies-title">{movieObj.original_title}</h5>
                                        {
                                            this.state.hover === movieObj.id && <a className="btn btn-primary favorite-btn" onClick={() => this.handleFavourites(movieObj)}> {this.state.favourites.includes(movieObj.id) ? "Remove From Favourites" : "Add to Favourites" } </a>
                                        }
                                        
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div style={{display:'flex', justifyContent: 'center'}}>
                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                <li class="page-item"><a class="page-link" onClick={this.handlePrev}>Previous</a></li>
                                {
                                    this.state.parr.map((value) => (
                                        <li class="page-item"><a class="page-link" onClick={() => this.handleClick(value)}>{value}</a></li>
                                        
                                    ))
                                }
                                <li class="page-item"><a class="page-link" onClick={this.handleNext}>Next</a></li>
                            </ul>
                        </nav>
                    </div>
                  </div>
              }               
            </>
        )
    }
}
