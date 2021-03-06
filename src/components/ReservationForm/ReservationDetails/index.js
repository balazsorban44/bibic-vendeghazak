import React from 'react'
import {Link} from "react-router-dom"
import People from './People'
import FoodService from './FoodService'
import {FormGroup} from '../../shared/Form'
import Calendar from './Calendar'
import Message from './Message'


const ReservationDetails = ({maxPeople}) =>
  <>
    <FormGroup
      className="dates"
      footnote="érkezés: 14:00-tól, távozás: 10:00-ig"
      title="érkezés/távozás"
    >
      <Calendar/>
    </FormGroup>
    <FormGroup
      footnote="6 év alatt ingyenes"
      title={`személyek (maximum ${maxPeople} fő)`}
    >
      <People {...{maxPeople}}/>
    </FormGroup>
    <FormGroup
      className="services"
      footnote={
        <>
        az ételeket előre kell kiválasztani, mivel nem üzemeltetünk éttermet <Link to="etelek?vissza=foglalás">
        főbb ételeinket ide kattintva találja →</Link>
        </>
      }
      title="igényelt ellátás"
    >
      <FoodService/>
    </FormGroup>
    <FormGroup
      className="message"
      title="megjegyzés"
    >
      <Message/>
    </FormGroup>
  </>

export default ReservationDetails