import React, { useState, useEffect, useCallback } from 'react'
import { Input, Pagination } from 'antd'
import { debounce } from 'lodash'

import Cards from '../cards/cards'
import MoviesService from '../../services/services'

const { Search } = Input

const SearchPage = () => {
  const [data, setData] = useState([])
  const [searchInputValue, setInputValue] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(null)
  const [errorMessage, setErrorMessage] = useState({ name: null, erorr: false })

  const moviesService = new MoviesService()

  const getMovies = (value) => {
    moviesService
      .getFilms(value, page)
      .then((data) => {
        if (data.results.length === 0) {
          setErrorMessage({ name: 'warning', error: true })
        } else {
          setData(data.results)
          console.log(data.results)
          setTotalPage(data.total_results < 500 ? data.total_results : 500)
          setLoading(true)
        }
      })
      .catch(() => {
        setErrorMessage({ name: 'error', error: true })
      })
  }

  useEffect(() => {
    setLoading(false)

    if (searchInputValue === null) {
      moviesService
        .getPopular(page)
        .then((data) => {
          setData(data.results)
          setTotalPage(data.total_results < 500 ? data.total_results : 500)
          setLoading(true)
        })
        .catch(() => {
          setErrorMessage({ name: 'error', error: true })
        })
    }

    if (searchInputValue) {
      getMovies(searchInputValue)
    }
  }, [page])

  const handleSearch = useCallback(
    debounce((value) => {
      setErrorMessage({ name: null, error: false })
      setLoading(false)
      setPage(1)
      getMovies(value)
    }, 1000),
    []
  )

  return (
    <div>
      <Search
        placeholder="Type to search..."
        onChange={(e) => {
          setInputValue(e.target.value)
          handleSearch(e.target.value)
        }}
        value={searchInputValue}
      />
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

export default SearchPage
