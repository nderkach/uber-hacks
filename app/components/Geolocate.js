import React, { Component } from 'react'
import { Glyphicon } from 'react-bootstrap'

export default class Geolocate extends Component {
  static defaultProps = {
    zIndex: 15,
    left: 22,
    bottom: 15,
    width: 35,
    height: 35,
    fontSize: 18
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      hover: false
    }
  }

  _onSuccess(position) {
    map.flyTo({
      center: [position.coords.longitude, position.coords.latitude],
      zoom: 17,
      bearing: 0,
      pitch: 0
    })
  }

  _onError(error) {

  }

  handleClick() {
    window.navigator.geolocation.getCurrentPosition(
                this._onSuccess, this._onError, { enableHighAccuracy: true });
  }

  render() {
    const styles = {
      container: {
        display: 'flex',
        position: 'absolute',
        top: this.props.top,
        bottom: this.props.bottom,
        right: this.props.right,
        left: this.props.left,
        zIndex: this.props.zIndex,
        backgroundColor: `rgb(25, 25, 25)`,
        cursor: `pointer`,
        borderRadius: '4px',
        width: this.props.width,
        height: this.props.height,
        textAlign: 'center',
        perspective: '50px'
      },
      glyph: {
        alignSelf: 'center',
        flexGrow: 1,
        position: 'relative',
        fontSize: this.props.fontSize,
        textShadow: (this.state.hover) ? `0 0 7px white` : ``,
        color: (this.state.hover) ? `rgb(255, 255, 255)` : `rgb(190, 190, 190)`
      }
    }
    return (
      <div
        style={ styles.container }
        onClick={ this.handleClick }
        onMouseEnter={ () => this.setState({ hover: true }) }
        onMouseLeave={ () => this.setState({ hover: false }) }
        >
        <Glyphicon style={ styles.glyph } glyph='screenshot' />
      </div>
    )
  }
}
