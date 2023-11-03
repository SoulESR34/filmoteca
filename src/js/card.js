const modalCard = document.querySelector("[data-modal-card]");
const cardData = document.querySelector("div.card__insert");
const cardImage = document.getElementById("moviePoster");
const cardLayout = document.querySelector(".card__layout");

function getMovie(movieId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNjA3ZmFhNzAyNmY1Y2UzZjZmNWZmYjI2ODFjYzJjNSIsInN1YiI6IjY1M2IyYzc0NTE5YmJiMDBmZTViNjg5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lMk5N_OwLrQTWkN06X6OFLuWdV3OipM3GTHJIBE0hdE",
    },
  };

  const urlCard = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  fetch(urlCard, options)
    .then((response) => response.json())
    .then((data) => {
      const movieData = data;

      const baseImageUrl = "https://image.tmdb.org/t/p/w500";
      const posterImageUrl = `${baseImageUrl}${movieData.poster_path}`;

      const imgHTML = `<img
                class="card__image--png"
                src="${posterImageUrl}"
                alt=""
              />`;
      cardImage.insertAdjacentHTML("afterBegin", imgHTML);

      const imgHTML1 = `<h2 class="card__data--title" id="movieTitle">${
        movieData.original_title ? movieData.original_title : "N/A"
      }</h2>
              <div class="card__characteristics">
                <table class="card__characteristics">
          <tr>
            <td class="movie__votecount card__characteristics--title">
              Voddte / Votes
            </td>
            <td class="movie__votecount card__characteristics--data">
              <span class="vote"
                >${
                  movieData.vote_average ? movieData.vote_average : "N/A"
                }</span
              >/ ${movieData.vote_count ? movieData.vote_count : "N/A"}
            </td>
          </tr>
          <tr>
            <td class="movie__popularity card__characteristics--title">
              Popularity
            </td>
            <td class="movie__popularity card__characteristics--data">
              ${movieData.popularity ? movieData.popularity : "N/A"}
            </td>
          </tr>
          <tr>
            <td class="movie__title card__characteristics--title">
              Original Title
            </td>
            <td
              class="movie__title card__characteristics--data"
              id="movieOriginalTitle">
              ${movieData.original_title ? movieData.original_title : "N/A"}
            </td>
          </tr>
          <tr>
            <td class="movie__originalgenre card__characteristics--title">
              Genre
            </td>
            <td class="movie__originalgenre card__characteristics--data">
              ${movieData.genres[0].name ? movieData.genres[0].name : "N/A"}
            </td>
          </tr>
        </table>
              </div>
              <h2 class="card__about">ABOUT</h2>
              <p class="card__about" id="movieOverview">
                ${movieData.overview ? movieData.overview : "N/A"}
              </p>
              <button class="btn__add btn__add--watcehd" type="button" data-add-watched data-modal-card-close>
                ADD TO WATCHED
              </button>
              <button class="btn__add btn__add--queue" type="button" data-add-queue data-modal-card-close>
                ADD TO QUEUE
              </button>

              <button type="button" class="btn__close" data-modal-card-close >
              <svg viewBox="0 0 24 24" width="30" height="30">
                <use href="./img/svg/icons.svg#mobilexit-menu"></use>
              </svg>
            </button>`;

      cardData.insertAdjacentHTML("afterBegin", imgHTML1);

      const addQueue = document.querySelector("[data-add-queue]");
      const addWatched = document.querySelector("[data-add-watched]");

      addQueue.addEventListener("click", function (event) {
        const queue = JSON.parse(localStorage.getItem("queue")) || [];
        const queueAlready = queue.some((movie) => movie.id === movieData.id);
        if (!queueAlready) {
          queue.push(movieData);
          localStorage.setItem("queue", JSON.stringify(queue));
          alert("Added");
        } else {
          alert("Already added");
        }
      });

      addWatched.addEventListener("click", function (event) {
        const watcehd = JSON.parse(localStorage.getItem("watched")) || [];
        const watcehdAlready = watcehd.some(
          (movie) => movie.id === movieData.id
        );
        if (!watcehdAlready) {
          watcehd.push(movieData);
          localStorage.setItem("watched", JSON.stringify(watcehd));
          alert("Added");
        } else {
          alert("Already added");
        }
      });

      const closeBtns = document.querySelectorAll("[data-modal-card-close]");
      closeBtns.forEach(function (closeBtn) {
        closeBtn.addEventListener("click", function (event) {
          modalCard.classList.add("is-hidden");
          setTimeout(function () {
            cardImage.innerHTML = "";
            cardData.innerHTML = "";
          }, 100);
        });
      });
    })

    .catch((err) => console.error(err));
}

let dynamicDomExecuted = false;

function dynamicDom() {
  if (!dynamicDomExecuted) {
    const openBtns = document.querySelectorAll("[data-id]");
    openBtns.forEach(function (openBtn) {
      openBtn.addEventListener("click", function (event) {
        let movieId = openBtn.getAttribute("data-id");
        getMovie(movieId);
        setTimeout(function () {
          modalCard.classList.remove("is-hidden");
        }, 500);
      });
    });
    dynamicDomExecuted = true;
  }
}

const observer = new MutationObserver(dynamicDom);
const observerConfig = { childList: true, subtree: true };
observer.observe(document.body, observerConfig);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalCard.classList.toggle("is-hidden");
    cardData.innerHTML = "";
    cardImage.innerHTML = "";
  }
});

document.addEventListener("click", function (event) {
  if (event.target === modalCard) {
    modalCard.classList.add("is-hidden");
    cardData.innerHTML = "";
    cardImage.innerHTML = "";
  }
});

cardLayout.addEventListener("click", function (event) {
  event.stopPropagation();
});
