const BTN_SELECTOR = '.js-tab-btn'
const PANEL_SELECTOR = '.js-tab-panel'
const ACTIVE_CLASS = '-active'

export default class Tab {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(el) {
    this.el = el
    this.btnEl = el.querySelectorAll(BTN_SELECTOR)
    this.panelEl = el.querySelectorAll(PANEL_SELECTOR)

    this.eventHandler()
  }

  eventHandler() {
    ;[...this.btnEl].map(el => {
      el.addEventListener('click', this.onBtnClick.bind(this))
    })
  }

  onBtnClick(ev) {
    const currentEl = ev.currentTarget
    const panelId = currentEl.getAttribute('aria-controls')

    // aria-controlsが同じID名の要素の表示を制御する
    this.switch(currentEl, panelId)
  }

  switch(currentEl, panelId) {
    const panelEl = document.getElementById(panelId)
    ;[...this.btnEl].map(el => {
      el.setAttribute('aria-selected', false)
      el.setAttribute('aria-expanded', false)
    })
    ;[...this.panelEl].map(el => {
      el.classList.remove(ACTIVE_CLASS)
    })

    currentEl.setAttribute('aria-selected', true)
    currentEl.setAttribute('aria-expanded', true)

    if (panelEl) {
      panelEl.classList.add(ACTIVE_CLASS)
    }
  }
}
