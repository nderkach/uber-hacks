import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { observer } from 'mobx-react'
import { store } from '../store'

@observer
export default class SearchRemove extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      hover: false
    }
  }

  handleClick() {
    store.results = []
    store.search = ''
  }

  render() {
    if (!store.search) return <div></div>

    let style = {
      position: 'absolute',
      right: 5,
      color: this.state.hover ? store.salmon : 'white',
      fontSize: 20,
      top: 14,
      cursor: `pointer`,
      textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
    }

    return (
      <div
        onClick={ this.handleClick }
        onMouseEnter={ () => this.setState({ hover: true }) }
        onMouseLeave={ () => this.setState({ hover: false }) }
        style={ style }>
        <Glyphicon glyph='remove' />
      </div>
    )
  }
}
