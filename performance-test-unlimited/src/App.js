import { Lightning, Utils } from 'wpe-lightning-sdk'

const rnd = (min, max) => {
  return ~~(Math.random() * (max - min)) + min;
};

export default class App extends Lightning.Component {
  static getFonts() {
    return [{
      family: 'Regular',
      url: Utils.asset('fonts/Roboto-Regular.ttf')
    }];
  }

  static _template() {
    return {
      Holder: {
        w: 1920,
        h: 1080
      },
      Label: {
        x: 50,
        y: 50,
        rect: true,
        w: 250,
        h: 54,
        Amount: {
          x: 10,
          y: 10,
          color: 0xff000000,
          text: {
            text: '',
            fontSize: 25
          }
        }
      }
    };
  }

  _handleEnter() {
    const children = new Array(10).fill('').map(() => {
      const dim = 30;
      const c = [rnd(0, 255), rnd(0, 255), rnd(0, 255)];
      return {
        type: Item,
        w: dim,
        h: dim,
        rect: true,
        x: rnd(50, 1870),
        y: rnd(50, 1030),
        color: Lightning.StageUtils.rgba(c[0], c[1], c[2], 1)
      };
    }); // append

    this.tag("Holder").childList.a(children); // update total

    this.tag("Amount").text = `${this.tag("Holder").children.length} items`;
  }

}

class Item extends Lightning.Component {
  _init() {
    this.animation({
      duration: 2,
      delay: 3,
      repeatDelay: 3,
      repeat: -1,
      actions: [{
        p: 'rotation',
        v: {
          0: 0,
          1: Math.PI * 2
        }
      }, {
        p: 'scale',
        v: {
          0: 1,
          0.5: 1.2,
          1: 1
        }
      }]
    }).start();
  }

}
