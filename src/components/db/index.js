import moment from 'moment'
import QueryString from 'query-string'
import React, {Component, createContext} from 'react'
import withRouter from 'react-router-dom/withRouter'
import {PARAGRAPHS_REF, ROOMS_REF, ROOM_SERVICES_REF, GALLERIES_REF} from '../../lib/firebase'
import {isQueryString, translate} from '../../utils/language'
import {valueToState} from '../../utils/validate'
import {submitReservation, getPrice} from './reservation'
import {isEquivalent} from '../../utils/compare'


const Store = createContext()
/**
 * Makes the Store values available
 * @param {Component} WrappedComponent The component to pass the store values to
 * @returns {Component} Component with the Store values
 */
export const withStore = WrappedComponent =>
  class extends Component {
    render() {
      return (
        <Store.Consumer>
          {values =>
            <WrappedComponent
              {...{
                ...values,
                ...this.props
              }}
            />
          }
        </Store.Consumer>
      )
    }
  }


const today = moment()
const tomorrow = today.clone().add(1, "day").startOf("day")

const initialReservation = {
  roomId: null,
  from: null,
  to: null,
  name: "",
  email: "",
  address: "",
  tel: "",
  message: "",
  adults: 1,
  children: [],
  foodService: "breakfast",
  price: 0
}

class Database extends Component {

  state = {
    isReserving: false,
    tomorrow,
    paragraphs: {},
    galleries: {},
    month: today,
    reservation: initialReservation,
    rooms: [],
    roomServices: []
  }


  // Fetch all initial data from Firebase.
  componentDidMount() {

    PARAGRAPHS_REF
      .on("value", snap => {
        const paragraphs = {}
        Object.entries(snap.val()).forEach(([paragraphType, paragraphList]) => {
          paragraphs[paragraphType] = Object.values(paragraphList)
            .sort((a, b) => a.order - b.order)
        })
        this.setState({paragraphs})
      })

    GALLERIES_REF
      .on("value", snap => {
        const galleries = {}
        Object.entries(snap.val()).forEach(([galleryType, galleryList]) => {
          galleries[galleryType] = Object.values(galleryList)
            .sort((a, b) => a.order - b.order)
        })
        this.setState({galleries})
      })


    ROOM_SERVICES_REF
      .on("value", snap =>
        this.setState({roomServices: Object.entries(snap.val())})
      )


    ROOMS_REF.once("value", snap => this.setState({rooms: snap.val()}))
      .then(() => this.updateByURL(this.props.location.search, true))
  }


  componentDidUpdate({location: {search: prevSearch}}, {reservation: prevReservation}) {
    const {search} = this.props.location
    const {reservation} = this.state

    if (!isEquivalent(prevReservation, reservation)) this.updatePrice()
    if (prevSearch !== search) {
      this.updateByURL(search)
      this.updatePrice()
    }
  }


  /*
   * ----------------------------------------------------------------------------
   * Reservation
   */


  handleSubmitReservation = e => {
    e.preventDefault()
    submitReservation(
      this.state.reservation,
      isReserving => this.setState({isReserving}),
      () => this.setState({reservation: initialReservation}),
      this.props.history,
      this.state.rooms
    )
  }


  /*
   * ----------------------------------------------------------------------------
   * Routing
   */


  /**
   * Updates the state from the URL
   * @param {object} values
   * @param {boolean} [isInitial=false]
   */
  updateByURL = (queryString, isInitial=false) => {
    if (queryString) {
      const reservation = {...this.state.reservation}
      queryString = QueryString.parse(queryString)
      Object.entries(queryString).forEach(([key, value]) => {
        key = translate(key)
        value = key === "foodService" ? translate(value) : value
        reservation[key] = valueToState(key, value)
      })

      this.setState({reservation}, () => {
        let {reservation: {from}} = this.state
        if (isInitial) {
          from = moment(from)
          this.setState({month: from})
        }
      })
    }
  }


  updatePrice = () => {
    const {
      rooms, reservation:{roomId}
    } = this.state
    const room = rooms.find(room => room.id === roomId)

    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      price: room ? getPrice(room, reservation) : 0
    }}))
  }

  /**
   * Updates the reservation either in the state or in the URL
   * If the key is not private, it adds the key=value pair to the URL
   * @param {string} key - reservation key
   * @param value - reservation value
   */
  updateReservation = (key, value) => {
    if (isQueryString(key)) {
      const {history} = this.props
      const search = QueryString.parse(history.location.search)
      search[translate(key)] = key === "foodService" ? translate(value) : value
      history.push(`foglalas?${ QueryString.stringify(search)}`)
    } else this.setState(({reservation}) => ({reservation: {
      ...reservation,
      [key]: value
    }}))
  }


  render() {
    return (
      <Store.Provider
        value={{
          submitReservation: this.handleSubmitReservation,
          updateReservation: this.updateReservation,
          ...this.state
        }}
      >
        {this.props.children}
      </Store.Provider>
    )
  }
}


export default withRouter(Database)
