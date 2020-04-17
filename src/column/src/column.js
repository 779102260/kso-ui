import Proto from '../../proto.js'
import { TableColumn } from 'element-ui'
import { formatDate } from 'kso-util'

// 本插件配置，新增属性以_开头
const config = {
  class: {},
  style: {},
  attrs: {},
  props: {
    _dateFormater: undefined
  },
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
Column.prototype.afterInitData = function () {
  // dateFormater 配置项处理
  this.dealDateFormater()
}
/**
 * 根据 dateFormater 配置项，对该列进行日期格式化
 */
Column.prototype.dealDateFormater = function (attrs) {
  let rule = this.$get(this.props, 'dateFormater')
  if (typeof rule !== 'string' && rule !== true) {
    return
  }
  // 规则转换
  switch (rule) {
    case true:
      rule = 'yyyy-MM-dd hh:mm:ss'
      break
    case 'date':
      rule = 'yyyy-MM-dd'
      break
    case 'all':
      rule = 'yyyy-MM-dd hh:mm:ss.mms'
      break
  }
  const prop = this.props.prop
  const scopeSolt = (scope) => {
    const date = new Date(scope.row[prop])
    return formatDate(date, rule)
  }
  this.$set(this, 'scopedSlots.default', scopeSolt)
}

export default {
  functional: true,
  name: 'kso-column',
  render(createElement, context) {
    const ist = new Column(createElement, context, config)
    return context.parent.$createElement(TableColumn, ist.getData(), ist.getChildren())
  }
}
export { Column }
