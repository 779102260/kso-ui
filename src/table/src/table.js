import { Table } from 'element-ui'
import Proto from '../../proto.js'

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
 *
 */
function KsoTable(createElement, context, config) {
  Proto.call(this, 'table', createElement, context, config)
  this.defaultData = {
    class: {},
    style: {},
    attrs: {
      border: true, // 有纵向边框
      sortable: false // 可本地排序（远程排序需要设为'custom'，且传入sort-change方法来改变表格数据）
    },
    props: {},
    domProps: {},
    on: {},
    nativeOn: {},
    directives: [],
    scopedSlots: {}
  }
}
KsoTable.prototype = Proto.prototype.inheirt(Proto)
KsoTable.prototype.constructor = KsoTable

export default {
  // ** 函数组件无data/computed/methods watch 生命周期
  functional: true,
  name: 'kso-table',
  // ** 组件使用是定义的属性（不算事件）分为2种：attrs和props
  // ** 属性如何在组件内部已定义为props都剥离给props，其他都会保留给普通的html属性(attrs)
  // 约束：这里只加新增的属性
  // props: Proto.prototype._getConfigKeys(config),
  // ** 实例后 context 获取不到这些自定义属性
  // xxxx: 1,
  /**
   * context 函数组件是无this实例，使用context作为上下文
   * {
   *  data, // 组件使用时解析的数据对象
   *  children, // 所有嵌套元素
   * }
   *
   * context.data
   * {
   *  attrs, // 组件使用时所有的属性都会认为时attrs
   *  props, //指明作为props（方便识别吧，估计只有开发人员用）
   *  on, // 绑定的事件
   *  nativeOn, // 绑定的原生事件 v-on:xx.native="fn"
   * }
   */
  render(createElement, context) {
    const ist = new KsoTable(createElement, context, config)
    return context.parent.$createElement(Table, ist.getData(), ist.getChildren())
  }
}
export { KsoTable }