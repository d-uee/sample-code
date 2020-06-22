import YouTubePlayer from '~/modules/YouTubePlayer'
import Tab from '~/modules/Tab'
import More from '~/modules/More'

document.addEventListener('DOMContentLoaded', () => {
  // youtube
  ;[...document.querySelectorAll('.js-youtube')].map(el => {
    new YouTubePlayer(el)
  })

  // tab
  ;[...document.querySelectorAll('.js-tab')].map(el => {
    new Tab(el)
  })

  // more
  ;[...document.querySelectorAll('.js-more')].map(el => {
    new More(el)
  })
})