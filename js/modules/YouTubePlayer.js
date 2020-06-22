import 'core-js/stable/object/assign'
import Player from 'youtube-player'

const IFRAME_SELECTOR = '.js-youtube-iframe'
const SOUND_SELECTOR = '.js-youtube-sound'
const PLAY_SELECTOR = '.js-youtube-play'
const PLAY_CONTROLL_SELECTOR = '.js-youtube-play-controll'

const PLAY_CLASS = '-play'
const ON_CLASS = '-on'

/**
 * YouTubePlayer class
 * @sample
  <div class="js-youtube">
    <div class="js-youtube-iframe" id="youtube001" data-option="{
      videoId: '',
      playerVars: {
        autoplay: 1,
        loop: 1,
      }
    }"></div>
  </div>
 */
export default class YouTubePlayer {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(el) {
    this.el = el
    this.iframeEl = this.el.querySelector(IFRAME_SELECTOR)
    this.soundEl = this.el.querySelector(SOUND_SELECTOR)
    this.playEl = this.el.querySelector(PLAY_SELECTOR)
    this.playControllEl = this.el.querySelector(PLAY_CONTROLL_SELECTOR)
    this.player = null
    this.loop = false
    this.autoplay = false
    this.duration = 0
    this.playerVars = {
      autoplay: 0,
      playsinline: 1,
      loop: 0,
      showinfo: 0,
      rel: 0,
      fs: 0,
      controls: 0
    }

    this.init()
  }

  async requestAnimationFrame() {
    const currentTime = await this.player.getCurrentTime()
    if (this.loop && this.autoplay && currentTime >= this.duration - 1) {
      this.replay()
    }
    window.requestAnimationFrame(this.requestAnimationFrame.bind(this))
  }

  async init() {
    // data-optionに設定されているオプションとデフォルトのオプションをマージする
    const option = this.iframeEl.dataset.option
      ? new Function('return ' + this.iframeEl.dataset.option)()
      : {}
    this.playerVars = Object.assign(this.playerVars, option.playerVars)

    // 標準のループだと読み込みアニメーションが発生するため、
    // 変数に保存しループは無効化しておく
    // 再生が終わったらシークを0にすることでループに対応
    this.loop = this.playerVars.loop > 0
    this.playerVars.loop = 0

    // オプション値を更新
    this.autoplay = this.playerVars.autoplay > 0

    option.playerVars = this.playerVars

    if (!option.videoId) return

    this.player = new Player(this.iframeEl.getAttribute('id'), option)
    this.player.on('ready', () => this.ready())
    this.player.on('stateChange', ev => this.stateChange(ev))

    this.iframeEl = await this.player.getIframe()

    if (this.loop) {
      this.requestAnimationFrame()
    }

    this.eventHandler()
  }

  eventHandler() {
    if (this.soundEl) {
      this.soundEl.addEventListener('click', this.onSound.bind(this))
    }
    if (this.playControllEl) {
      this.playControllEl.addEventListener(
        'click',
        this.onPlayControll.bind(this)
      )
    }
    if (this.playEl) {
      this.playEl.addEventListener('click', this.replay.bind(this))
    }
  }

  onSound(ev) {
    ev.preventDefault()
    if (this.soundEl.classList.contains(ON_CLASS)) {
      this.soundEl.classList.remove(ON_CLASS)
      this.player.mute()
    } else {
      this.soundEl.classList.add(ON_CLASS)
      this.player.unMute()
    }
  }

  async onPlayControll() {
    const state = await this.player.getPlayerState()
    if (state === 1) {
      this.player.pauseVideo()
    } else if (state === 2 || state === 5) {
      this.play()
    }
  }

  async ready() {
    this.duration = await this.player.getDuration()

    if (this.autoplay) {
      this.player.mute()
      this.play()
    }
  }

  stateChange(ev) {
    // requestAnimationFrameでのループが失敗したときの保険でいれておく
    if (ev.data === 0 && this.loop) {
      this.player.seekTo(0, true)
      this.play()
    }
    // 再生中
    if (ev.data === 1) {
      this.el.classList.add(PLAY_CLASS)
    }
    // 終了、停止
    if (ev.data === 0 || ev.data === 2) {
      this.el.classList.remove(PLAY_CLASS)
    }
  }

  play() {
    this.player.playVideo()
  }

  replay() {
    this.player.seekTo(0, true)
    this.play()
  }
}
