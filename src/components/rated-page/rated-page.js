import React, { useContext, useEffect, useState } from 'react'
import { Pagination } from 'antd'

import Cards from '../cards/cards'
import GuestSessionContext from '../../context/guest-session-context'
import MoviesService from '../../services/services'

const RatedPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(null)
  const [errorMessage, setErrorMessage] = useState({ name: null, erorr: false })

  const sessinContext = useContext(GuestSessionContext)
  const { guest_session_id } = sessinContext

  const moviesService = new MoviesService()

  useEffect(() => {
    setLoading(false)
    moviesService
      .getRatedGuestSession(guest_session_id, page)
      .then((data) => {
        if (data.results.length === 0) {
          setErrorMessage({ name: 'warning', error: true })
        } else {
          setErrorMessage({ name: null, error: false })
          setData(data.results)
          setTotalPage(data.total_results < 500 ? data.total_results : 500)
          setLoading(true)
        }
      })
      .catch(() => {
        setErrorMessage({ name: 'error', error: true })
      })
  }, [page])

  return (
    <div>
      <Cards data={data} loading={loading} errorMessage={errorMessage} />
      <Pagination
        current={page}
        onChange={(page) => setPage(page)}
        total={totalPage}
        pageSize={20}
        showSizeChanger={false}
      />
    </div>
  )
}

export default RatedPage
