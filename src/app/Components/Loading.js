import React from 'react'
import style from '../Styles/Loading.module.css'
const Loading = () => {
  return (
    <div className={style.loadingcontainer}>
      <div className={style.loadingspinner}></div>
      <div>Loading...</div>
    </div>
  )
}

export default Loading