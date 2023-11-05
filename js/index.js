import { galleryFilms, renderMovies } from './gallery.js';
import { searchFilms } from './search.js'

galleryFilms();
const searchform = document.querySelector(".search-form");
searchform.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  console.log(form)
  const movieName = form.elements.busqueda.value;
  searchFilms(movieName);
});

const libraryButton = document.getElementById('libraryButton');
libraryButton.addEventListener('click', () => {
  const activeButton = document.querySelector('.active');
  if (activeButton) {
    activeButton.classList.remove('active');
  }

  libraryButton.classList.add('active');
});

