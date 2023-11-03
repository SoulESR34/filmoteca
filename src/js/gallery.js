import { fetchInitalMovies, fetchMovieGenres } from './film.js';
import { placeholderImageBase64 } from './placeholder64.js';

const movieList = document.querySelector('ul.movie__list');
const genreArray = [];

const itemsPerPage = 10; // Ajusta este número según tus preferencias
let currentPage = 1;

document.querySelector('#prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    galleryFilms(currentPage);
  }
});

document.querySelector('#nextPage').addEventListener('click', () => {
  currentPage++;
  galleryFilms(currentPage);
});

function galleryFilms(page = 1, searchName) {
  fetchMovieGenres()
    .then((genres) => {
      genreArray.push(...genres);
      return fetchInitalMovies(page, searchName);
    })
    .then((response) => {
      const movieArray = response.results;
      renderMovies(movieArray);
    })
    .catch((err) => console.error(err));
}

function renderMovies(movieArray) {
  const movieMarkup = movieArray
    .map(({ id, title, poster_path, release_date, genre_ids }) => {
      const urlImg = 'https://image.tmdb.org/t/p/original/';
      const date = new Date(release_date);
      const year = date.getFullYear();
      const genres = genre_ids
        .map((genreId) => {
          const genre = genreArray.find((genre) => genre.id === genreId);
          return genre ? genre.name : 'N/A';
        })
        .join(', ');

      const posterUrl = poster_path ? urlImg + poster_path : placeholderImageBase64;

      return `
        <li class="movie__item" data-id="${id}">
          <img
            class="movie__poster"
            src="${posterUrl}"
            alt="${title}"
          />
          <div class="movie__info">
            <h2 class="movie__title">${title}</h2>
            <p class="movie__details">${genres} | ${year}</p>
          </div>
        </li>`;
    })
    .join('');

  movieList.innerHTML = movieMarkup;
}

document.querySelector('.btn__add--watched').addEventListener('click', () => {
  displayWatchedMovies();
});

document.querySelector('.btn__add--queue').addEventListener('click', () => {
  displayQueueMovies();
});

function displayQueueMovies() {
  const queueMovies = JSON.parse(localStorage.getItem('queue')) || [];
  const watchedMovies = JSON.parse(localStorage.getItem('watched')) || [];

  if (queueMovies.length === 0) {
    movieList.innerHTML = '<p>Your Queue is empty, try adding some movies.</p>';
    const returnButton = document.createElement('button');
    returnButton.textContent = 'Return to All Movies';
    returnButton.addEventListener('click', () => {
      galleryFilms();
    });
    movieList.appendChild(returnButton);
  } else {
    const queueMovieIds = queueMovies.map((movie) => movie.id);

    const allMovieItems = document.querySelectorAll('.movie__item');
    allMovieItems.forEach((movieItem) => {
      const movieId = parseInt(movieItem.getAttribute('data-id'));
      if (queueMovieIds.includes(movieId) && !watchedMovies.some((watched) => watched.id === movieId)) {
        movieItem.style.display = 'block';
      } else {
        movieItem.style.display = 'none';
      }
    });
  }
}

function displayWatchedMovies() {
  const watchedMovies = JSON.parse(localStorage.getItem('watched')) || [];

  if (watchedMovies.length === 0) {
    movieList.innerHTML = '<p>You have no movies watched, try adding one.</p>';
    const returnButton = document.createElement('button');
    returnButton.textContent = 'Return to All Movies';
    returnButton.addEventListener('click', () => {
      galleryFilms();
    });
    movieList.appendChild(returnButton);
  } else {
    const watchedMovieIds = watchedMovies.map((movie) => movie.id);

    const allMovieItems = document.querySelectorAll('.movie__item');
    allMovieItems.forEach((movieItem) => {
      const movieId = parseInt(movieItem.getAttribute('data-id'));
      if (watchedMovieIds.includes(movieId)) {
        movieItem.style.display = 'block';
      } else {
        movieItem.style.display = 'none';
      }
    });
  }
}

const eraseListsButton = document.getElementById('eraseListsButton');
eraseListsButton.addEventListener('click', () => {
  localStorage.clear();
  alert('Your lists have been erased.');
});

document.getElementById('libraryButton').addEventListener('click', () => {
  displayWatchedMovies();
});

document.getElementById('homeButton').addEventListener('click', (e) => {
  e.preventDefault();
  galleryFilms();
});

export { movieList, galleryFilms, renderMovies };
