const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNWI0OWM3OGZiOWM3MzdjYzliOTY2ZTYyNGZiMzM2OCIsInN1YiI6IjY1MzljMGU3Njc4MjU5MDBjN2U4MzA1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NKkY_ulExDHUWkpgOszRCBSGMcjpe0pUHtb9dF-rIOM',
    },
  };
  
  function fetchInitalMovies(page = 3, name = '') {
    let urlType;
    if (name) {
      urlType = `https://api.themoviedb.org/3/search/movie?&query=${name}`;
    } else {
      urlType = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
    }
  
    return fetch(`${urlType}&page=${page}`, options).then(response =>
      response.json()
    );
  }
  
  function fetchMovieGenres() {
    return fetch(
      'https://api.themoviedb.org/3/genre/movie/list?language=en',
      options
    )
      .then(response => response.json())
      .then(data => data.genres);
  }
  
  export { fetchInitalMovies, fetchMovieGenres };
  