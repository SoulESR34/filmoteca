import { movieList, galleryFilms, renderMovies } from "./gallery.js";

const searchform = document.querySelector(".search-form");

function searchFilms(name) {
    const page = 1;
    movieList.innerHTML = "";
    galleryFilms(page, name);
}

export { searchFilms };
