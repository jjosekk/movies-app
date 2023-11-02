import React, { useEffect, useState, useContext } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'
import parseISO from 'date-fns/parseISO'

import MoviesService from '../../services/services'
import GuestSessionContext from '../../context/guest-session-context'
import Genres from '../../context/genres-context'

import './card.css'

const Card = (props) => {
  const [voteAverage, setVoteAverage] = useState(0)
  const [guestRating, setGuestRating] = useState(0)

  const sessinContext = useContext(GuestSessionContext)
  const { guest_session_id } = sessinContext

  const genresContext = useContext(Genres)
  const { genres } = genresContext

  const { el } = props
  const { title, release_date, overview, poster_path, id, genre_ids } = el

  const truncate = (str) => {
    const maxLength = 140
    let currentLength = 0
    let result = []

    str.split(' ').forEach((el) => {
      if (currentLength > maxLength) return
      currentLength += el.length
      result.push(el)
    })

    return str.length > maxLength ? result.join(' ') + '...' : result.join(' ')
  }

  const moviesService = new MoviesService()

  useEffect(() => {
    moviesService
      .getFilmsDetails(id)
      .then((data) => setVoteAverage(data.vote_average === 0 ? data.vote_average : data.vote_average.toFixed(1)))
  }, [])

  const setRatingFilm = (value) => {
    setGuestRating(value)
    const ratedFilms = JSON.parse(localStorage.getItem('rated-films')) || []
    localStorage.setItem('rated-films', JSON.stringify([...ratedFilms, { id, value }]))
    moviesService.setRatingFilms(guest_session_id, id, value)
  }

  const ratedFilms = JSON.parse(localStorage.getItem('rated-films')) || []

  return (
    <div className="card">
      <div className="poster">
        {poster_path ? (
          <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="poster" />
        ) : (
          <img src={'http://skazka-audio.ru/source/img/skazki/0843_sm_mk_ezhidze.jpg'} alt="poster" />
        )}
      </div>
      <div className="body">
        <div className="poster--mobile">
          {poster_path ? (
            <img src={`https://image.tmdb.org/t/p/original/${poster_path}`} alt="poster" />
          ) : (
            <img src={'http://skazka-audio.ru/source/img/skazki/0843_sm_mk_ezhidze.jpg'} alt="poster" />
          )}
        </div>
        <div className="title">
          <h5>{title}</h5>
          <div
            className="rating"
            style={{
              borderColor:
                voteAverage >= 7 ? '#66E900' : voteAverage >= 5 ? '#E9D100' : voteAverage >= 3 ? '#E97E00' : '#E90000',
            }}
          >
            {voteAverage}
          </div>
        </div>
        <div className="date">{release_date && format(parseISO(release_date), 'MMMM d, y')}</div>
        <div className="category">
          {genres
            ?.filter((genre) => genre_ids.some((el) => genre.id === el))
            .slice(0, 3)
            .map((el, index) => (
              <div className="item" key={index}>
                {el.name}
              </div>
            ))}
        </div>
        <div className="description">{truncate(overview)}</div>
        <Rate
          disabled={ratedFilms?.find((el) => el.id === id)?.value || guestRating ? true : false}
          className="rate-star"
          count={10}
          allowHalf
          onChange={(value) => setRatingFilm(value)}
          value={ratedFilms?.find((el) => el.id === id)?.value || guestRating}
        />
      </div>
    </div>
  )
}

export default Card
