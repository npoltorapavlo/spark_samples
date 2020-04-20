import { Lightning, Utils, MediaPlayer } from 'wpe-lightning-sdk'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      MediaPlayer: {
        type: MediaPlayer
      }
    }
  }

  _init() {
    this.tag('MediaPlayer').updateSettings({
      consumer: this,
      hide: false,
      videoPos: [0, 0, 1280, 720],
      stream: {
        src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    })

    this.tag('MediaPlayer')._attach()
  }

  // Media events
  $mediaplayerProgress(e) {
    console.log('$mediaplayerProgress ' + e.currentTime + ' ' + e.duration)
  }
  $mediaplayerEnded() {
    console.log('$mediaplayerEnded')
  }
  $mediaplayerStop() {
    console.log('$mediaplayerStop')
  }
  $mediaplayerPause() {
    console.log('$mediaplayerPause')
  }
  $mediaplayerSeeking() {
    console.log('$mediaplayerSeeking')
  }
  $mediaplayerSeeked() {
    console.log('$mediaplayerSeeked')
  }
  $mediaplayerLoad() {
    console.log('$mediaplayerLoad')
  }
  $mediaplayerStart() {
    console.log('$mediaplayerStart')
  }
  $mediaplayerPlaying() {
    console.log('$mediaplayerPlaying')
  }
  $mediaplayerPlay() {
    console.log('$mediaplayerPlay')
  }
  $mediaplayerLoadedData() {
    console.log('$mediaplayerLoadedData')
  }
  $mediaplayerError() {
    console.log('$mediaplayerError')
  }

  // Key handlers
  _handleEnter() {
    this.tag('MediaPlayer').reload()
  }
  _handleLeft() {
    let player = this.tag('MediaPlayer')
    player.getPosition().then(() => player.seek(-10))
  }
  _handleRight() {
    let player = this.tag('MediaPlayer')
    player.getPosition().then(p => player.seek(p + 10, true))
  }
  _handleUp() {
    this.tag('MediaPlayer').close()
  }
  _handleDown() {
    this._isPaused = !this._isPaused
    if (this._isPaused) this.tag('MediaPlayer').doPause()
    else this.tag('MediaPlayer').doPlay()
  }
}
