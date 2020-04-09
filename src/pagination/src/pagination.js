import Proto from '../../proto.js'
import { Pagination } from 'element-ui'

import './style.css'

const config = {}
/**
 * Pgae
 */
function Page(createElement, context, config) {
  Proto.call(this, 'pagination', createElement, context, config)
  this.defaultProps = {
    'current-page': 1,
    'page-sizes': [10, 20, 30, 60],
    layout: 'total, sizes, prev, pager, next',
    'hide-on-single-page': true
  }
  this.events = ['size-change', 'current-change', 'prev-click', 'next-click']
}
Page.prototype = new Proto()
Page.prototype.constructor = Page

export default {
  functional: true,
  name: 'kso-pagination',
  props: config,
  render(createElement, context) {
    const ist = new Page(createElement, context, config)
    return context.parent.$createElement(Pagination, ist.getContextData(), ist.getChildren())
  }
}
export { Page }
