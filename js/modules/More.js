const ITEM_SELECTOR = '.js-more-item'
const ADD_BUTTON_SELECTOR = '.js-more-add'
const DISPLAY_NONE_CLASS = 'd-none'
const TRANSPARENT_CLASS = '-transparent'

export default class More {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(el) {
    const addNum = el.dataset.addNum

    this.el = el
    this.addNum = addNum ? Number(addNum) : 15 // 初期値を設定
    this.itemEl = this.el.querySelectorAll(ITEM_SELECTOR)
    this.addButtonEl = this.el.querySelector(ADD_BUTTON_SELECTOR)

    if (!this.el) return

    this.eventHandler()
  }

  /**
   * 非表示のアイテムを返す
   * @return NodeList
   */
  get hideItemEl() {
    return [...this.itemEl].filter(el => {
      const styles = window.getComputedStyle(el)
      return styles.getPropertyValue('display') === 'none'
    })
  }

  /**
   * 非表示のアイテムの中から表示する要素を返す
   * @return NodeList
   */
  get addEl() {
    return this.hideItemEl.slice(0, this.addNum)
  }

  eventHandler() {
    this.addButtonEl.addEventListener('click', this.onAddClick.bind(this))
  }

  onAddClick() {
    this.add()
  }

  add() {
    const addEl = this.addEl

    addEl.forEach((el, i) => {
      el.classList.remove(DISPLAY_NONE_CLASS)
      el.classList.add(TRANSPARENT_CLASS)
      setTimeout(() => {
        el.classList.remove(TRANSPARENT_CLASS)
      }, 50 * (i + 1))
    })

    if (this.addEl.length === 0) {
      this.addButtonEl.classList.add(DISPLAY_NONE_CLASS)
      return
    }
  }
}
