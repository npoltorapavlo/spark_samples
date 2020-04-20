import { Lightning, Utils } from 'wpe-lightning-sdk'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      MyTexture: {
        texture: {
          type: lng.Stage.platform.createApplicationTexture(),
          id: Math.floor(1000 + Math.random() * 9000),
          priority: 10,
          x: 0,
          y: 0,
          w: 640,
          h: 360,
          cx: 0,
          cy: 0,
          sx: 1.0,
          sy: 1.0,
          r: 0,
          a: 1,
          interactive: true,
          painting: true,
          clip: false,
          mask: false,
          draw: true,
          launchParams: {"cmd": "spark", uri: "browser.js"}
        }
      }
    };
  }

  _handleSearch(){ // key "/"
    const myTexture = this.tag("MyTexture");
    if (this._searchPressed) {
      myTexture.texture.setFocus(this._searchPressed = false);
    } else {
      myTexture.texture.setFocus(this._searchPressed = true);
    }
  }
}
