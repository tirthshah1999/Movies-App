import React, { Component } from "react";
import { movies } from "./getMovies";

export default class Favourites extends Component {
  constructor() {
    super();
    this.genreIds = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    this.state = {
      genres: [],
      currGenre: "All Genres",
      movies: [],
      currText: "",
      currPage: 1,
      limit: 5,
    };
  }

  componentDidMount = () => {
    // Getting genres and movies that has been marked favourite by user
    let data = JSON.parse(localStorage.getItem("movies-app") || "[]");
    let temp = [];

    data.forEach((movieObj) => {
      if (!temp.includes(this.genreIds[movieObj.genre_ids[0]])) {
        temp.push(this.genreIds[movieObj.genre_ids[0]]);
      }
    });

    temp.unshift("All Genres");
    this.setState({
      genres: [...temp],
      movies: [...data],
    });
  };

  // Making currGenre as selected genre
  handleGenre = (genre) => {
    this.setState({
      currGenre: genre,
    });
  };

  // this - other > 0 (Asc sort)
  sortPopularityAsc = () => {
    let temp = this.state.movies;
    temp.sort(function (objA, objB) {
      return objA.popularity - objB.popularity;
    });

    this.setState({
      movies: [...temp],
    });
  };

  // other - this > 0 (Desc sort)
  sortPopularityDesc = () => {
    let temp = this.state.movies;
    temp.sort(function (objA, objB) {
      return objB.popularity - objA.popularity;
    });

    this.setState({
      movies: [...temp],
    });
  };

  sortRatingAsc = () => {
    let temp = this.state.movies;
    temp.sort(function (objA, objB) {
      return objA.vote_average - objB.vote_average;
    });

    this.setState({
      movies: [...temp],
    });
  };

  sortRatingDesc = () => {
    let temp = this.state.movies;
    temp.sort(function (objA, objB) {
      return objB.vote_average - objA.vote_average;
    });

    this.setState({
      movies: [...temp],
    });
  };

  handlePageChange = (page) => {
    this.setState({
      currPage: page,
    });
  };

  handleDelete = (movieObj) => {
    // Changing movies and genres of favorites after deleted  
    let newMoviesArr = [];
    let newGenresArr = [];

    newMoviesArr = this.state.movies.filter((movie) => movie.id !== movieObj.id);
    localStorage.setItem("movies-app", JSON.stringify(newMoviesArr));
      
    let data = JSON.parse(localStorage.getItem("movies-app") || "[]");
    data.forEach((movieObj) => {
        if (!newGenresArr.includes(this.genreIds[movieObj.genre_ids[0]])) {
          newGenresArr.push(this.genreIds[movieObj.genre_ids[0]]);
        }
      });

    newGenresArr.unshift("All Genres");
  
    this.setState({
      movies: [...newMoviesArr],
      genres: [...newGenresArr]
    });

  };

  render() {
    // filtering movies by searching movie
    let filterMoviesArr = [];

    if (this.state.currText === "") {
      filterMoviesArr = this.state.movies;
    } else {
      filterMoviesArr = this.state.movies.filter((movie) => {
        let title = movie.original_title.toLowerCase();
        return title.includes(this.state.currText.toLowerCase());
      });
    }

    // filtering movies by selected genre
    if (this.state.currGenre !== "All Genres") {
      filterMoviesArr = this.state.movies.filter(
        (movie) => this.genreIds[movie.genre_ids[0]] === this.state.currGenre
      );
    }

    // Setting limit (how many movies to be shown as per user selection)
    let page = Math.ceil(filterMoviesArr.length / this.state.limit); // (21 / 5 gives 4) so + 1 need
    let pageArr = [];
    for (let i = 1; i <= page; i++) {
      pageArr.push(i);
    }

    let si = (this.state.currPage - 1) * this.state.limit;
    let ei = si + this.state.limit;

    filterMoviesArr = filterMoviesArr.slice(si, ei);

    return (
      <div className="main">
        <div className="row">
          <div className="col-lg-3 col-sm-12">
            <ul className="list-group fav-genres">
              {
                this.state.genres.map((genre) =>
                    this.state.currGenre === genre ? 
                    <li
                        className="list-group-item"
                        style={{
                        background: "blue",
                        color: "#fff",
                        fontWeight: "bold",
                        }}
                    >
                        {genre}
                    </li> : 
                    <li
                        className="list-group-item"
                        onClick={() => this.handleGenre(genre)}
                    >
                        {genre}
                    </li>
                )
              }
            </ul>
          </div>
          <div className="col-lg-9 col-sm-12 fav-table">
            <div className="row">
              <input
                type="text"
                className="input-group-text col"
                placeholder="Search"
                value={this.state.currText}
                onChange={(e) => this.setState({ currText: e.target.value })}
              />
              <input
                type="number"
                className="input-group-text col"
                placeholder="Rows Count"
                value={this.state.limit}
                onChange={(e) =>
                  e.target.value > 0 && this.setState({ limit: e.target.value })
                }
              />
            </div>
            <div className="row">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Genre</th>
                    <th scope="col">
                      <i
                        className="fas fa-sort-up"
                        onClick={this.sortPopularityDesc}
                      />
                      Popularity
                      <i
                        className="fas fa-sort-down"
                        onClick={this.sortPopularityAsc}
                      />
                    </th>
                    <th scope="col">
                      <i
                        className="fas fa-sort-up"
                        onClick={this.sortRatingDesc}
                      />
                      Rating
                      <i
                        className="fas fa-sort-down"
                        onClick={this.sortRatingAsc}
                      />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.movies.length === 0 ? 
                    <h3 className="text-end text-primary mt-5">No Favourites</h3> : 
                    filterMoviesArr.map((movieObj) => (
                      <tr>
                        <td scope="row">
                          <img
                            src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`}
                            alt={movieObj.title}
                            style={{ width: "5rem" }}
                          />{" "}
                          {movieObj.original_title}
                        </td>
                        <td>{this.genreIds[movieObj.genre_ids[0]]}</td>
                        <td>{movieObj.popularity}</td>
                        <td>{movieObj.vote_average}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => this.handleDelete(movieObj)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <nav aria-label="Page navigation example">
              <ul class="pagination">
                {
                    pageArr.map((page) => (
                    <li className="page-item">
                        <a
                        className="page-link"
                        onClick={() => this.handlePageChange(page)}
                        >
                        {page}
                        </a>
                    </li>
                    ))
                }
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}
