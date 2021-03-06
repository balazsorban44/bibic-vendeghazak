import React, {Component} from 'react'
import {withStore} from '../db'
import {FormSection, Send} from '../shared/Form'
import {toPrice} from '../../utils/language'
import RoomSelector from './RoomSelector'
import RoomServices from './RoomServices'
import PersonalDetails from '../shared/PersonalDetails'
import ReservationDetails from './ReservationDetails'
import Footnote from './Footnote'

import "./reservation.sass"
import ToastContainer from '../ToastContainer';

export class ReservationForm extends Component {

  componentDidMount() {window.scrollTo(0, 0)}

  handleSubmitReservation = e => {
    e.preventDefault()
    this.props.submitReservation()
  }

  render() {
    const {
      rooms, reservation: {price, ...reservation}, isReserving, updateReservation
    } = this.props
    const roomId = reservation.roomId
    const maxPeople = (rooms.length && roomId && rooms[roomId-1] && rooms[roomId-1].prices.metadata.maxPeople) || 1

    return(
      <form
        action=""
        className="form"
      >
        <ToastContainer/>
        <h2>Foglalás</h2>
        <RoomSelector/>
        <RoomServices/>
        <FormSection title="Személyi adatok">
          <PersonalDetails
            footnote="(számla kiállításához szükséges adatok)"
            onChange={updateReservation}
            personalDetails={reservation}
          />
        </FormSection>
        <FormSection title="Foglalás adatai">
          <ReservationDetails maxPeople={maxPeople}/>
        </FormSection>
        <Send
          isLoading={isReserving}
          onClick={this.handleSubmitReservation}
        >
            Küldés
          <span className="footnote-asterix">
            {toPrice(price)}
          </span>
        </Send>
        <Footnote/>
      </form>
    )
  }
}

export default withStore(ReservationForm)