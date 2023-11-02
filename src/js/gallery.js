import { fetchInitalMovies, fetchMovieGenres } from './film.js';
import { placeholderImageBase64 } from "./placeholder64.js";

const movieList = document.querySelector("ul.movie__list");

function galleryFilms(page = 1, searchName) {
  let genreArray;

  fetchMovieGenres()
    .then((genres) => {
      genreArray = genres;
    })
    .catch((err) => console.error(err));

  fetchInitalMovies(page, searchName)
    .then((response) => {
      console.log(response);
      const movieArray = response.results;
      renderMovies(movieArray, genreArray);
    })
    .catch((err) => console.error(err));
}

function renderMovies(movieArray, genreArray) {
  const movieMarkup = movieArray
    .map(({ id, title, poster_path, release_date, genre_ids }) => {
      const urlImg = "https://image.tmdb.org/t/p/original/";
      const date = new Date(release_date);
      const year = date.getFullYear();
      const genreIds = genre_ids;
      let genres = [];

      for (let i = 0; i < 2 && i < genreIds.length; i++) {
        const genreId = genreIds[i];
        const genre = genreArray.find((genre) => genre.id === genreId);
        if (genre) {
          genres.push(genre.name);
        }
      }

      const posterUrl = poster_path
        ? urlImg + poster_path
        : placeholderImageBase64;

      return `
            <li class="movie__item" data-id ="${id}" >
              <img
                class="movie__poster"
                src= "${posterUrl}"
                alt="${title}"
              />
              <div class="movie__info">
                <h2 class="movie__title">${title}</h2>
                <p class="movie__details">${genres.join(", ")} | ${year}</p>
              </div>
            </li>`;
    })
    .join("");

  movieList.insertAdjacentHTML("beforeend", movieMarkup);
}

export { movieList, galleryFilms, renderMovies };