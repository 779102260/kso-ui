import Proto from '../../proto.js'
import { Pagination } from 'element-ui'
import './style.css'

// 本插件配置
const config = {
  class: {},
  style: {},
  attrs: {},
  props: {},
  domProps: {},
  on: {},
  nativeOn: {},
  directives: [],
  scopedSlots: {}
}
/**
 * Pgae
 */
function Page(createElement, context, config) {
  Proto.call(this, 'pagination', createElement, context, config)
  this.defaultData = {
    class: {},
    style: {},
    attrs: {
      'current-page': 1,
      'page-sizes': [10, 20, 30, 60],
      layout: 'total, sizes, prev, pager, next',
      'hide-on-single-page': true
    },
    props: {},
    domProps: {},
    on: {},
    nativeOn: {},
    directives: [],
    scopedSlots: {}
  }
}
Page.prototype = Proto.prototype.inheirt(Proto)
Page.prototype.constructor = Page

export default {
  functional: true,
  name: 'kso-pagination',
  render(createElement, context) {
    const ist = new Page(createElement, context, config)
    return context.parent.$createElement(Pagination, ist.getData(), ist.getChildren())
  }
}
export { Page }
