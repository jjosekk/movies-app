export default class MoviesService {
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMDlmMDM0YjgxZjI5NmQxZTUwYzIzMWMwY2M1NGE2ZCIsInN1YiI6IjY1MmE0NDhiZjI4ODM4MDJhMDBhMTNjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.TQye9ck55HeJ1WZ7AuJbd-ttIhL-T--gAQVXG7x1v58',
    },
  }

  async createGuestSession() {
    const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', this.options)
    const data = await response.json()

    return await data
  }

  async getRatedGuestSession(guestSessionId, page = 1) {
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=e09f034b81f296d1e50c231c0cc54a6d&page=${page}`
    )

    const data = await response.json()
    return data
  }

  async setRatingFilms(guestSessionId, filmId, rating) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${filmId}/rating?api_key=e09f034b81f296d1e50c231c0cc54a6d&guest_session_id=${guestSessionId}`,

      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    )
    const data = await response.json()

    return await data
  }

  async getResource(url) {
    const response = await fetch(`${url}`, this.options)
    const data = await response.json()

    return await data
  }

  async getFilms(name, page = 1) {
    const response = await this.getResource(
      `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}`
    )
    return await response
  }

  async getPopular(page = 1) {
    const response = await this.getResource(`https://api.themoviedb.org/3/movie/popular?page=${page}`)
    return await response
  }

  async getFilmsDetails(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, this.options)
    const data = await response.json()

    return await data
  }

  async getGenres() {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', this.options)
    const data = await response.json()

    return await data
  }
}
