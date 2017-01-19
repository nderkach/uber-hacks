import React from 'react'
import { Glyphicon, Input } from 'react-bootstrap'
import { observer } from 'mobx-react'
import { store } from '../store'
import { Result, SearchRemove, Remove } from '../components'
import { getBounds, getCenter } from './utils'

@observer
export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.getLocation = this.getLocation.bind(this)
    this.handleKeyEnter = this.handleKeyEnter.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  getLocation(location) {
    let bounds = map.getBounds()
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${ location }&bounds=${ bounds._ne.lat },${ bounds._ne.lng }|${ bounds._sw.lat },${ bounds._sw.lng }`
    fetch(url).then(response => response.json())
      .then(data => {
        if (location == store.search) store.results = data.results.slice(0, 3)
      })
      .catch(error => console.log("Error found"))
  }

  handleKeyEnter(e) {
    let result = store.results[store.selection]
    if (result) {
      let bounds = getBounds(result.geometry)
      let center = getCenter(result.geometry)
      if (bounds) map.fitBounds(bounds)
      else if (center) map.flyTo({center: center, zoom: 13})
      store.results = []
    }
  }

  handleKeyDown(e) {
    if (e.key == 'Enter') this.handleKeyEnter()
    if (e.key == 'ArrowDown') store.selection = Math.min(store.results.length, store.selection + 1)
    if (e.key == 'ArrowUp') store.selection = Math.max(0, store.selection - 1)
  }

  handleChange(e) {
    store.selection = 0
    store.search = e.target.value
    if (store.search) this.getLocation(store.search)
    else store.results = []
  }

  render() {
    const styles = {
      container: {
        position: 'absolute',
        left: '20%',
        right: '20%',
        width: '60%',
        top: 90,
        zIndex: 30,
      },
      remove: {
        position: 'absolute',
        right: 10,
        color: 'black',
        fontSize: '1.5em',
        top: 30,
        cursor: `pointer`,
      },
      search: {
        paddingLeft: '5px',
        textTransform: 'none',
        fontFamily: 'Roboto',
        fontWeight: 400,
        letterSpacing: '-.045em',
        border: 'none',
        color: 'black',
        borderBottom: 'black',
        borderBottomStyle: 'solid',
        borderBottomWidth: 'thin',
        fontSize: '2rem',
        lineHeight: 2,
        outline: 'none',
        height: '50px',
        backgroundColor: 'white',
        transition: 'none',
        width: '100%',
        WebkitFontSmoothing: 'antialiased',
        WebKitTransition: 'none',
        boxShadow: '0 0 3px #888888'
      }
    }

    return (
      <div style={ styles.container } block>
        <SearchRemove />
        <input
          bsSize="large"
          type="text"
          bsStyle="link"
          ref="search"
          style={ styles.search }
          value={ store.search }
          className={ 'search' }
          bsStyle='default'
          placeholder="Choose a city..."
          onKeyDown={ this.handleKeyDown }
          onChange={ this.handleChange }
          block
        />
        { store.results.map((result, index) =>
          <Result key={ result.place_id } index={ index } json={ result } />
        )}
      </div>
    )
  }
}
