import React, { Component } from "react";
//import getMovies method from our service
import { getMovies } from "../services/fakeMovieService";
import Like from "./common/like";
import Pagination from "./common/pagination";
class Movies extends Component {
  //initialize the state of the component by calling the method you've imported
  state = {
    movies: getMovies(),
    pageSize: 4,
  };
  //create an event onclick to delete a movie
  handleDelete = (movie) => {
    //we will get all the movies except the one we are passing to the method
    //when we click "delete", the state will change with the method setState,
    //p.s if we have duplicates variables like below "movies:movies" we can write only "movies", its the same thing
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };
  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    console.log(page);
  };

  render() {
    //we are descructuring the object, changing the name of "length" to "count" for make the code much readable
    // so "count" will have the number of movies in our fake databaase
    //down below we are saying "if the number of movies are equal to 0 , show message 'There are no movies in the databse' "
    //otherwise show the number of movies in the databse
    const { length: count } = this.state.movies;
    if (count === 0) return <p>There are no movies in the database</p>;
    return (
      <>
        <p>Showing {count} movies in the database</p>

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Stock</th>
              <th>Rate</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.movies.map((movie) => (
              //whenever we are using the map method of the array, we must set the key wich is unique for all the elements of the array
              <tr key={movie._id}>
                <td>{movie.title}</td>
                <td>{movie.genre.name}</td>
                <td>{movie.numberInStock}</td>
                <td>{movie.dailyRentalRate}</td>
                <td>
                  <Like
                    liked={movie.liked}
                    onClick={() => this.handleLike(movie)}
                  />
                </td>
                <td>
                  <button
                    onClick={() => this.handleDelete(movie)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          itemsCount={count}
          pageSize={this.state.pageSize}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}
export default Movies;
