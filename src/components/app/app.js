import React, { useEffect, useState } from 'react'
import { Result, Tabs, Alert, Button } from 'antd'
import { Offline, Online } from 'react-detect-offline'

import SearchPage from '../search-page/search-page'
import RatedPage from '../rated-page/rated-page'
import GuestSessionContext from '../../context/guest-session-context'
import Genres from '../../context/genres-context'
import MoviesService from '../../services/services'

import './app.css'

const App = () => {
  const [guestSession, setGuestSession] = useState({})
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    const moviesService = new MoviesService()

    moviesService
      .createGuestSession()
      .then((data) => setGuestSession(data))
      .catch(() => setError(true))

    moviesService
      .getGenres()
      .then((data) => setGenres(data))
      .catch(() => setError(true))

    localStorage.clear()
  }, [])

  const refreshPage = () => {
    window.location.reload()
  }

  if (error) {
    return (
      <div className="error-data">
        <Alert
          message="Error"
          showIcon
          type="error"
          action={
            <Button size="big" danger onClick={refreshPage}>
              Refresh page
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <GuestSessionContext.Provider value={guestSession}>
      <Genres.Provider value={genres}>
        <div>
          <Online>
            <Tabs
              destroyInactiveTabPane="true"
              centered
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Search',
                  children: <SearchPage />,
                },
                {
                  key: '2',
                  label: 'Rated',
                  children: <RatedPage />,
                },
              ]}
            />
          </Online>

          <Offline>
            <Result className="offline" status="error" title="емае интернета больше нет" />
          </Offline>
        </div>
      </Genres.Provider>
    </GuestSessionContext.Provider>
  )
}

export default App
