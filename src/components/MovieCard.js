import React from "react";

const MovieCard = ({ movie, selectMovie }) => {
  const { id, title: name, release_date: date, overview: info } = movie;

  const handleScrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const IMAGE_PATH = "https://image.tmdb.org/t/p/w780"
  // console.log(movie)
  return (
    <div className={"movie-card"} onClick={()=> selectMovie(movie)}>
      {movie.poster_path ? <img className='img' src={`${IMAGE_PATH}${movie.poster_path}`} onClick={ handleScrollToTop} alt={name} />
        :
        <div className="movie-placeholder">No Image Found</div>
      }

      <h5 className="movie-title">{name}</h5>
      <p>{date}</p>
      <button className="btn"
      type="submit">More details</button>
    </div>
  );
};

export default MovieCard;
