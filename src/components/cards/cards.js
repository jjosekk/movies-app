import React from 'react'
import { Spin, Alert } from 'antd'

import Card from '../card/card'

import './cards.css'

const Cards = (props) => {
  const { data, loading, errorMessage } = props

  if (errorMessage.name === 'error' && errorMessage.error === true) {
    return <Alert className="error-message" message="Error" type="error" showIcon errorMessage={errorMessage} />
  }

  if (errorMessage.name === 'warning' && errorMessage.error === true) {
    return <Alert className="error-message" message="no results" type="warning" showIcon closable />
  }

  if (!loading) {
    return (
      <div className="example">
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </div>
    )
  }

  return (
    <div className="cards">
      {data.map((el) => {
        return <Card key={el.id} el={el} />
      })}
    </div>
  )
}

export default Cards
