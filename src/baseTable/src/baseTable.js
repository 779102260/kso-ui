/**
 * 基础固有功能性封装，可拆卸：
 * 1. 列功能
 * - 行可定制功能
 * 2. 增加翻页功能
 * 3. 远程数据功能 [x]
 * 4. 远程排序功能 [x]
 */
/**
 * todo：
 * 1. change 事件
 */
import Table from '../../table/src/table.js'
import Column from '../../column/src/column.js'
import Pagination from '../../pagination/src/pagination.js'

import Proto from '../../proto.js'

// 本插件配置（分类)，新增属性以_开头
const config = {
  class: {},
  style: {},
  attrs: {
    _columns: Object,
    _pagination: Object // 分页,
  },
  props: {},
  domProps: {},
  on: {
    _change: Function // 排序 切换页 切
  },
  nativeOn: {},
  directives: [],
  scopedSlots: {}
}
/**
 *
 */
function BaseTable(createElement, context, config) {
  Proto.call(this, 'base-table', createElement, context, config)
  // 改变
  // this.changeInfo = {
  //   pageNumber: 1,
  //   pageSize: 10,
  //   sortName: '',
  //   sortOrder: ''
  // }
}
BaseTable.prototype = Proto.prototype.inheirt(Proto)
BaseTable.prototype.constructor = BaseTable
// 使原函数与change事件一起被调用
BaseTable.prototype._bindWithChange = function (eventName, fn) {
  return (...argus) => {
    fn && fn(eventName, ...argus)
    this.on.change(eventName, ...argus)
  }
}

BaseTable.prototype._buildPaginationContextData = function (conf) {
  const data = this.filterByConfig(conf, this.config.props._pagination)
  // attrs
  // 1. change
  // 如果配置了change事件，给列增加排序事件，通过排序事件触发change
  if (this.on && this.on.change) {
    const currentChange = this._bindWithChange(
      'current-change',
      this.$get(conf, 'on.current-change')
    )
    const sizeChange = this._bindWithChange('size-change', this.$get(conf, 'on.size-change'))
    const prevClick = this._bindWithChange('prev-click', this.$get(conf, 'on.prev-click'))
    const nextClick = this._bindWithChange('next-click', this.$get(conf, 'on.next-click'))
    this.$set(data, 'on.current-change', currentChange)
    this.$set(data, 'on.size-change', sizeChange)
    this.$set(data, 'on.prev-click', prevClick)
    this.$set(data, 'on.next-click', nextClick)
  }
  return data
}
BaseTable.prototype._createPaginationVNode = function () {
  const conf = this.attrs.pagination
  const data = this._buildPaginationContextData(conf)
  const children = [] // todo
  return this.createElement(Pagination, data, children)
}
BaseTable.prototype._buildColumnContextData = function (conf) {
  const data = this.filterByConfig(conf, this.config.props._columns)
  // ...
  return data
}
BaseTable.prototype._createColumnVNode = function (conf) {
  const children = [] // todo
  return this.createElement(Column, this._buildColumnContextData(conf), children)
}
BaseTable.prototype._createColumnsVNodes = function () {
  const VNodes = []
  const columns = this.attrs.columns
  if (!columns) {
    return
  }
  for (const conf of columns) {
    const VNode = this._createColumnVNode(conf)
    VNodes.push(VNode)
  }
  return VNodes
}
BaseTable.prototype._buildTableContextData = function () {
  const data = this.getData()
  // on
  // 1. change
  // 如果配置了change事件，给列增加排序事件，通过排序事件触发change
  if (this.on && this.on.change) {
    const currentChange = this._bindWithChange(this.on['sort-change'])
    data.on['sort-change'] = currentChange
  }
  // ...
  return data
}
BaseTable.prototype._createTableVNode = function () {
  let children = []
  const columns = this._createColumnsVNodes()
  children = [...children, ...columns]
  // todo  [context.data 应该保持干净]
  return this.createElement(Table, this._buildTableContextData(), children)
}
BaseTable.prototype.getChildren = function () {
  const children = []
  // table
  const TableVNode = this._createTableVNode()
  children.push(TableVNode)
  // pagination
  let hasPagination = false
  try {
    hasPagination = !!this.attrs.pagination.props.total
  } catch (e) {
    // empty
  }
  // 有 total 才插入分页
  if (hasPagination) {
    const PaginationVNode = this._createPaginationVNode()
    children.push(PaginationVNode)
  }
  return children
}

export default {
  functional: true,
  name: 'base-table',
  render(createElement, context) {
    const ist = new BaseTable(context.parent.$createElement, context, config)
    return context.parent.$createElement('div', {}, ist.getChildren())
  }
}
export { BaseTable }
