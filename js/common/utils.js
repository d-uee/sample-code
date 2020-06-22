import { BREAKPOINT_SP } from '~/common/config'

/**
 * 画面サイズがSP判定
 * @return boolean
 */
export const isSP = () => {
  return window.innerWidth <= BREAKPOINT_SP
}
