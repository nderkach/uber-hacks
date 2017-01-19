import { observable, computed } from 'mobx'
import validator from 'validator'

export const store = new class Store {
  @observable svg = ''
  @observable png = ''

  // HTML
  @observable height = window.innerHeight
  @observable width = window.innerWidth

  // Search
  @observable search = ''
  @observable results = []
  @observable selection = 0

  // App Options
  @observable orientation = 1
  @observable material = 1
  @observable size = 1
  @observable email = ''

  // Map
  @observable zoom = 12
  @observable lat = 37.7577
  @observable lng = -122.4376
  @observable bearing = 0.0
  @observable pitch = 0.0
  @observable style = 1
  @observable mapId = 'map'
  @observable token = 'pk.eyJ1IjoibmRlcmthY2giLCJhIjoiRmhTM0wtayJ9.gUjWi8kjG_uUl0ckvJMUdw'

  styleTable = {
    1: 'mapbox://styles/nderkach/ciy3d4xt8007y2sp6lwxztku0'
  }

  sizeTable = {
    1: {1: '24" x 18"', 2: '18" x 24"'},
    2: {1: '36" x 24"', 2: '24" x 36"'},
    3: {1: '48" x 36"', 2: '36" x 48"'}
  }

  sizeTableName = {
    1: '24" x 18"',
    2: '36" x 24"',
    3: '48" x 36"'
  }

  materialTable = {
    1: 'Acrylic',
    2: 'Backlit Film'
  }

  orientationTable = {
    1: 'Landscape',
    2: 'Portrait'
  }

  tiel = '#4AC7B0'
  grey = '#494141'
  salmon = '#FB7461'
  lightGrey = '#E6E6DD'
  mediumGrey = '#B9BDB1'
  lightBlue = '#ACC6CB'

  constructor() {
    this.api_url = 'https://uber-hacks.herokuapp.com'
    // this.api_url = 'http://0.0.0.0:5000'
    window.addEventListener('resize', this.listenerResize.bind(this))
  }

  @computed get styleMax() {
    return Object.keys(this.styleTable).length
  }

  @computed get isXs() {
    return this.width < 768
  }

  @computed get isSm() {
    return 768 <= this.width && this.width < 992
  }

  @computed get isMd() {
    return 992 <= this.width && this.width < 1200
  }

  @computed get isLg() {
    return this.width >= 1200
  }

  @computed get sizeText() {
    return this.sizeTable[this.size][this.orientation]
  }

  @computed get materialText() {
    return this.materialTable[this.material]
  }

  @computed get orientationText() {
    return this.orientationTable[this.orientation]
  }

  @computed get emailValid() {
    return validator.isEmail(this.email)
  }

  @computed get price() {
    const prices = {
      'Backlit Film': {
        '24" x 18"': 400,
        '36" x 24"': 600,
        '48" x 36"': 975
      },
      'Acrylic': {
        '24" x 18"': 500,
        '36" x 24"': 800,
        '48" x 36"': 1200
      }
    }
    const material = this.materialTable[this.material]
    const size = this.sizeTableName[this.size]
    return prices[material][size]
  }

  listenerResize(e) {
    this.height = window.innerHeight
    this.width = window.innerWidth
  }
}
