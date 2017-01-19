import mapboxgl from 'mapbox-gl'
// import Directions from 'mapbox-gl-directions'
import React from 'react'
import { observer } from 'mobx-react'
import { store } from '../store'
import autobind from 'autobind-decorator'

function fixLongitude(lng) {
  // Positive
  if (lng > 180) {
    // West
    if (Math.floor(Math.abs(lng) / 180 % 2) == 1) {
      return -180 + lng % 180
    }
    // East
    else {
      return lng % 180
    }
  }
  // Negative
  else if (lng < -180) {
    // West
    if (Math.floor(Math.abs(lng) / 180 % 2) == 1) {
      return 180 + lng % 180
    }
    // East
    else {
      return lng % 180
    }
  }
  return lng
}

@observer
export default class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
  }

  componentDidMount() {
    mapboxgl.accessToken = store.token
    if (!mapboxgl.supported()) {
        console.log('WARNING: Your browser is not officailly supported by Mapbox GL');
    }
    const map = new mapboxgl.Map({
      container: store.mapId,
      style: store.styleTable[store.style],
      center: [store.lng, store.lat],
      bearing: store.bearing,
      pitch: store.pitch,
      zoom: store.zoom,
      attributionControl: false
    })
    window.map = map

    // const directions = new Directions({
    //   unit: 'metric', // Use the metric system to display distances.
    //   profile: 'driving', // Set the initial profile to walking.
    // });
    // window.directions = directions;

    this.setState({ 
      active: true,
      oldCenter: map.getCenter(),
      destination: null
    })
    map.on('movebegin', this.setState({ oldCenter: map.getCenter() }))
    map.on('moveend', this.handleMove)
    map.on('click', this.handleClick)
    map.on('load', this._addCenterMarker)
    map.on('load', this._onLoad)

    map.on('zoom', function() {
    })
  }

  _addCenterMarker() {
    let center = map.getCenter()

    map.addSource("center", {
      "type": "geojson",
      "data": {
        "type": "Point",
        "coordinates": [
          center.lng,
          center.lat
        ]
      }
    });

    map.addLayer({
      "id": "center-point",
      "source": "center",
      "type": "symbol",
      "layout": {
        "icon-image": "center_pin",
      }
    });

    // directions.setOrigin(center.lng, center.lat);
  }

  @autobind
  _onLoad() {
    this.props.onOriginChange(map.getCenter())

    map.addSource("destination", {
      "type": "geojson",
      "data": this.state.destination
    });

    map.addLayer({
      id: 'destination-point',
      source: 'destination',
      "type": "symbol",
      "layout": {
        "icon-image": "destination_pin",
      }
    });

  }

  @autobind
  _updateCenterMarker() {
    // frames = [];
    // for (let percent = 0; percent < 1; percent += 0.01) {
    //   let curLat = this.state.oldCenter.lat + percent * (map.getCenter().lat - this.state.oldCenter.lat);
    //   let curLng = this.state.oldCenter.lng + percent * (map.getCenter().lng - this.state.oldCenter.lng);
    //   frames.push({'lng': curLng, 'lat': curLat});
    // }

    // function sleep(ms) {
    //   return new Promise(resolve => setTimeout(resolve, ms));
    // }

    // let _animateMarker = async function(latlngs, index, wait, newDestination) {
    //   map.getSource('center').setData({
    //     "type": "Point",
    //     "coordinates": [
    //       latlngs[index].lng,
    //       latlngs[index].lat
    //     ]
    //   })
    //   if(index != latlngs.length-1) {
    //     await sleep(wait)
    //     _animateMarker(latlngs, index+1, wait); 
    //   }
    //   else {
    //     return;
    //   }
    // }

    // _animateMarker(frames, 0, 1);

    map.getSource('center').setData({
      "type": "Point",
      "coordinates": [
        map.getCenter().lng,
        map.getCenter().lat
      ]
    })

    this.state.oldCenter = map.getCenter()
  }

  @autobind
  handleMove(e) {
    store.zoom = map.getZoom().toPrecision(3)
    store.center = map.getCenter()
    store.lat = store.center.lat.toPrecision(6)
    store.lng = fixLongitude(store.center.lng).toPrecision(6)
    store.pitch = Math.floor(map.getPitch())
    store.bearing = Math.floor(map.getBearing())
    this._updateCenterMarker()

    this.props.onOriginChange(map.getCenter())
  }

  @autobind
  handleClick(e) {
    map.getSource('destination').setData({
      "type": "Point",
      "coordinates": [
        e.lngLat.lng,
        e.lngLat.lat
      ]
    })

    // directions.setDestination([e.lngLat.lng, e.lngLat.lat]);

    this.props.onDestinationChange(e.lngLat)
  }

  render() {
    const styles = {
      map: {
        width: '100%',
        bottom: '0px',
        top: '0px',
        position: 'absolute',
        margin: 0
      }
    }
    return (
      <div
        id={ store.mapId }
        style={ styles.map }>
        { this.state.active && this.props.children }
      </div>
    )
  }
}
