import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { store } from '../store'
import { ListGroup, ListGroupItem, Label, OverlayTrigger, Tooltip } from 'react-bootstrap';

@observer
export default class Price extends Component {
  render() {
    let style = {
      paddingTop: '10px'
      // boxSizing: 'border-box',
      // height: '44px',
      // border: '1px solid rgb(229, 229, 228)',
      // font: 'normal normal normal normal 14px / 28px ff-clan-web-pro, "Helvetica Neue", Helvetica, sans-serif'
    }

    const tooltip = (
      <Tooltip id="tooltip">Surge multiplier</Tooltip>
    );

    var variants = this.props.variants.map(v =>  
      <ListGroupItem  header={ v.product } key={v.key}>
       ${ v.price } {' '}
      <OverlayTrigger placement="right" overlay={tooltip}>
        <Label>{v.surge}</Label>
      </OverlayTrigger>
      </ListGroupItem>
    );

    return (
      <ListGroup style={ style }>
        {variants}
      </ListGroup>
    )
  }
}
