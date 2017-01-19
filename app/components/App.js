import React, { Component } from 'react'
import { Grid, Row, Col, Overlay, Popover } from 'react-bootstrap'
import { observer } from 'mobx-react'
import { store } from '../store'
import axios from 'axios';
import autobind from 'autobind-decorator'
import {
  Map,
  Search,
  getBounds,
  NorthArrow,
  TitlView,
  ZoomIn,
  ZoomOut,
  Options,
  Checkout,
  Basemap,
  BoundingBox,
  PanDown,
  Price,
  Geolocate,
  URLHandler } from '../components'

@observer
export default class App extends Component {
  constructor(props) {
    super(props)

    // Store all URL Queries into MobX Store
    Object.keys(props.location.query).map((key) => {
      store[key] = props.location.query[key]
    })

    // Store all URL Params into MobX Store
    Object.keys(props.params).map((key) => {
      store[key] = props.params[key]
    })

    this.state = {
      variants: [],
      loading: false,
      destinationMissing: true
    };
  }

  @autobind
  onRequest() {

    if (!this.state.destination) {
      this.state.destinationMissing = true
      return
    }

    this.setState({loading: true});

    axios.post(store.api_url + '/api/v1/fare_estimate', {
      "origin": {"lat": this.state.origin.lat, "lon": this.state.origin.lng},
      "destination": {"lat": this.state.destination.lat, "lon": this.state.destination.lng}
    })
    .then(res => {
      // const fareInfos = res.data.packageVariants.map(variant => variant.pricingInfo).filter(v => "fareInfo" in v)
      // const variants = fareInfos.map(f => ({ "price": parseFloat(f.fareInfo.upfrontFare.fare), "surge": f.fareInfo.upfrontFare.surgeMultiplier, "key": f.packageVariantUuid }));
      this.setState({ variants: res.data, loading: false });
    })
  }

  @autobind
  onOriginChange(loc) {
    this.setState({origin: loc})
  }

  @autobind
  onDestinationChange(loc) {
    this.state.destinationMissing = false
    this.setState({destination: loc})
  }

  render() {
    const styles = {
      container: {
        backgroundColor: 'white'
      },
      left: {
        height: store.height,
        padding: 0,
        margin: 0,
        overflow: 'hidden'
      },
      right: {
        overflowY: 'auto',
        padding: 0,
        height: store.height,
        paddingBottom: '50px'
      },
      row: {
        marginBottom: 0
      },
      overlay: {
        paddingTop: '20px',
      },
    }
    return (
      <Grid fluid={ true } style={ styles.container }>
        <Row style={ styles.row }>
          { /* App */ }
          <URLHandler />

          { /* Map */ }
          <Col xs={12} sm={8} md={8} lg={9} style={ styles.left }>
            <Overlay
              show={this.state.destinationMissing}
              placement="right"
              container={this}
              style={styles.overlay}
            >
              <Popover id="popover-contained">
                Select destination on the map!
              </Popover>
            </Overlay>
            <Map onOriginChange={this.onOriginChange} onDestinationChange={this.onDestinationChange}>
              <NorthArrow />
              <TitlView />
              <ZoomIn />
              <ZoomOut />
              <Geolocate />
            </Map>
            <PanDown />
          </Col>

          { /* Options */ }
          <Col xs={12} sm={4} md={4} lg={3} style={ styles.right }>
            <Options onRequest={this.onRequest} loading={this.state.loading} />
            <Price variants={this.state.variants} />
          </Col>
        </Row>
      </Grid>
    )
  }
}