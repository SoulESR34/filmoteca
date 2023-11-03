import { galleryFilms, renderMovies } from './gallery.js';
import { searchFilms } from './search.js'

searchFilms();
galleryFilms();

const libraryButton = document.getElementById('libraryButton');
libraryButton.addEventListener('click', () => {
  const activeButton = document.querySelector('.active');
  if (activeButton) {
    activeButton.classList.remove('active');
  }

  libraryButton.classList.add('active');
});