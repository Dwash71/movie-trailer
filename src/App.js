/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";
import axios from "axios";
import YouTube from "react-youtube";

const App = () => {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original/";

  // state management
  const API_URL = "https://api.themoviedb.org/3";
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [playTrailer, setPlayTrailer] = useState(false);

  // fetchMovies
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";

    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        query: searchKey,
      },
    });

    // setSelectedMovie(results[0]);
    setMovies(results);
    await selectMovie(results[0]);
  };
  // fetch  movie video
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        append_to_response: "videos",
      },
    });
    return data;
  };

  const selectMovie = async (movie) => {
    setPlayTrailer(false);
    const data = await fetchMovie(movie.id);
    setSelectedMovie(data);
    // console.log('movie data', data)
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ));

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(
      (vid) => vid.name === "Official Trailer"
    );

    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;
    // return Youtube container params
    return (
      <YouTube
        className="youtube-container"
        videoId={key}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0,
          },
        }}
      />
    );
  };

  return (
    <div className="App">
      <header className={"header"}>
        <div className={"header-content max-center"}>
          <span className={"title-head"}>
            DGene<span1>sis</span1> Mov<span1>ie</span1>
          </span>
          {/* form submit */}
          <form onSubmit={searchMovies}>
            <input
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchKey(e.target.value)
              }
              className="input-bar"
              placeholder="Search for movie"
            />
            <button type={"submit"} className="submit">
              Search
            </button>
          </form>
        </div>
      </header>
      {/* Hero area */}
      <div
        className={"hero"}
        style={{
          backgroundImage: `url(${IMAGE_PATH}${selectedMovie.backdrop_path})`,
        }}
      >
        <div className={"hero-content max-center"}>
          <button className={"button"} onClick={() => setPlayTrailer(true)}>
            Play Trailer
          </button>
          {playTrailer ? (
            <button
              className={"button button--close"}
              onClick={() => setPlayTrailer(false)}
            >
              Close
            </button>
          ) : null}
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          {/* hero title */}

          <h1 className={"hero-title"}>{selectedMovie.title}</h1>
          {selectedMovie.overview ? (
            <p className="hero-info"> {selectedMovie.overview}</p>
          ) : null}
        </div>
      </div>
      {/* render area */}
      <div className="container max-center">{renderMovies()}</div>
    </div>
  );
};

export default App;
