import React from 'react'
import {Link} from 'react-router-dom'
// For the slider elements
import arrow from '../../assets/icons/arrow.svg'
import swipe from '../../assets/icons/swipe.svg'

export const Prev = ({onClick}) =>
  <div
    className="slider-arrow slider-arrow-prev"
    onClick={onClick}
  >
    <img
      alt=""
      src={arrow}
    />
  </div>


export const Next = ({onClick}) =>
  <div
    className="slider-arrow slider-arrow-next"
    onClick={onClick}
  >
    <img
      alt=""
      src={arrow}
    />
  </div>


export const SwipeIcon = ({
  isShowingSwipe = true, ...rest
}) =>
  <img
    {...rest}
    alt=""
    className={`swipe-icon ${!isShowingSwipe ? "is-touched": ""}`}
    src={swipe}
  />


export const Loading = () => <div className="loading"><div className="spinner"/></div>

export const Button = ({
  label, to
}) =>
  <Link {...{to}} >{label}</Link>