import { movieList, galleryFilms, renderMovies } from "./gallery.js";

const searchform = document.querySelector(".search-form");

function searchFilms() {
  searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const movieName = form.elements.search.value;
    // problema con la paginacion, se debe definir aca tambien.
    const page = 1;
    movieList.innerHTML = "";
    galleryFilms(page, movieName);
  });
}

export { searchFilms };