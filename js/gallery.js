import { fetchInitalMovies, fetchMovieGenres } from './film.js';
import { placeholderImageBase64 } from './placeholder64.js';

const movieList = document.querySelector('ul.movie__list');
const genreArray = [];

const itemsPerPage = 10;
let totalPages = 0;
let currentPage = 1;
const homeButton = document.querySelector('.hero__btn--home');

function calculateTotalPages(totalResults) {
  totalPages = Math.min(Math.ceil(totalResults / itemsPerPage), 500);
  return totalPages;
}

function generatePageNumbers(currentPage) {
  const pageNumberContainer = document.getElementById('pageNumberContainer');
  pageNumberContainer.innerHTML = '';

  const maxPagesBeforeAfter = Math.min(5, currentPage - 1);

  const startPage = Math.max(1, currentPage - maxPagesBeforeAfter);
  const endPage = Math.min(totalPages, startPage + 9);

  createPageButton(1);

  if (startPage > 2) {
    createEllipsis();
  }

  for (let page = startPage; page <= endPage; page++) {
    if (page !== 1 && page !== totalPages) {
      createPageButton(page);
    }
  }

  if (endPage < totalPages - 1) {
    createEllipsis();
  }

  createPageButton(totalPages);

  document.getElementById('prevPage').style.display = 'block';
  document.getElementById('nextPage').style.display = 'block';
}

function createPageButton(page) {
  const pageNumberContainer = document.getElementById('pageNumberContainer');
  const pageNumber = document.createElement('button');
  pageNumber.textContent = page;
  pageNumber.className = 'pagination-button';
  if (page === currentPage) {
    pageNumber.classList.add('active');
  }
  pageNumber.addEventListener('click', () => {
    currentPage = page;
    galleryFilms(currentPage);
  });
  pageNumberContainer.appendChild(pageNumber);
}

function createEllipsis() {
  const pageNumberContainer = document.getElementById('pageNumberContainer');
  const ellipsis = document.createElement('span');
  ellipsis.textContent = '...';
  pageNumberContainer.appendChild(ellipsis);
}

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage = Math.max(1, currentPage - 1);
    galleryFilms(currentPage);
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage = Math.min(totalPages, currentPage + 1);
    galleryFilms(currentPage);
  }
});

function galleryFilms(page = 1, searchName) {
  showPaginator();
  fetchMovieGenres()
    .then((genres) => {
      genreArray.push(...genres);
      return fetchInitalMovies(page, searchName);
    })
    .then((response) => {
      const movieArray = response.results;
      renderMovies(movieArray);

      totalPages = calculateTotalPages(response.total_results);

      generatePageNumbers(page);
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
  hidePaginator();
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

function hidePaginator() {
  const paginator = document.querySelector('.pagination');
  paginator.style.display = 'none';
}

function showPaginator() {
  const paginator = document.querySelector('.pagination');
  paginator.style.display = 'block';
}

const eraseListsButton = document.getElementById('eraseListsButton');
eraseListsButton.addEventListener('click', () => {
  localStorage.clear();
  alert('Your lists have been erased.');
  location.reload();
  homeButton.click();
});

document.getElementById('libraryButtonV1').addEventListener('click', () => {
  displayWatchedMovies();
});

document.getElementById('homeButton').addEventListener('click', (e) => {
  e.preventDefault();
  galleryFilms();
});


export { movieList, galleryFilms, renderMovies };
