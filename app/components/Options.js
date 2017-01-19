import React from 'react'
import classNames from 'classnames'
import { Button, ButtonGroup } from 'react-bootstrap'
import { observer } from 'mobx-react'
import { store } from '../store'

@observer
export default class Options extends React.Component {

  static defaultProps = { }

  constructor(props) {
    super(props)
  }

  render() {
    let styles = {
      container: {
        paddingTop: 90,
        textAlign: 'center'
      },
      title: {
        textTransform: 'none',
        fontWeight: 'normal',
        color: '#E6E6DD',
        fontFamily: '"AlteHaasGrotesk", "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }
    }
    let buttonOn = 'success'
    let buttonOff = 'info'
    let buttonSize = ''

    let text = this.props.loading? "Loading...": "Calculate Fare"

    return (
      <div style={ styles.container }>
        <Button
          bsStyle={this.props.loading? 'warning': 'danger'}
          onClick={this.props.onRequest}
          disabled={this.props.loading}
        >
        { text }
        </Button>
      </div>
    )
  }
}
