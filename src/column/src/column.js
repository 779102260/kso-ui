import Proto from '../../proto.js'
import { TableColumn } from 'element-ui'

// 本插件配置，新增属性以_开头
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
 * Column
 */
function Column(createElement, context, config) {
  Proto.call(this, 'column', createElement, context, config)
  this.defaultData = {
    class: {},
    style: {},
    attrs: {
      sortable: false
    },
    props: {},
    domProps: {},
    on: {},
    nativeOn: {},
    directives: [],
    scopedSlots: {}
  }
}
Column.prototype = Proto.prototype.inheirt(Proto)
Column.prototype.constructor = Column

export default {
  functional: true,
  name: 'kso-column',
  render(createElement, context) {
    const ist = new Column(createElement, context, config)
    return context.parent.$createElement(TableColumn, ist.getData(), ist.getChildren())
  }
}
export { Column }
