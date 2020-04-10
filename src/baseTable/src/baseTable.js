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


// 本插件配置（分类）
const config = {
  class: {},
  style: {},
  attrs: {},
  props: {
    columns: {}, // 列
    pagination: Object, // 分页,
  },
  domProps: {},
  on: {
    change: Function // 排序 切换页 切
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
BaseTable.prototype._bindWithChange = function(fn) {
  return () => {
    fn && fn()
    this.on.change()
  }
}

BaseTable.prototype._buildPaginationContextData = function(conf) {
  const attrs = this.filterByConfig(conf, this.config.props.pagination)
  // attrs
  // 1. change 
  // 如果配置了change事件，给列增加排序事件，通过排序事件触发change
  if (this.on.change) {
    const currentChange = this._bindWithChange(conf['current-change'])
    const sizeChange = this._bindWithChange(conf['size-change'])
    const prevClick = this._bindWithChange(conf['prev-click'])
    const nextClick = this._bindWithChange(conf['next-click'])
    attrs['current-change'] = currentChange
    attrs['size-change'] = sizeChange
    attrs['prev-click'] = prevClick
    attrs['next-click'] = nextClick
  }
  return {attrs}
}
BaseTable.prototype._createPaginationVNode = function () {
  const conf = this.attrs.pagination
  const data = this._buildPaginationContextData(conf)
  const children = [] // todo
  return this.createElement(Pagination, data, children)
}
BaseTable.prototype._buildColumnContextData = function(conf) {
  const attrs = this.filterByConfig(conf, this.config.props.columns)
  // ...
  return {attrs}
}
BaseTable.prototype._createColumnVNode = function (conf) {
  const children = [] // todo
  return this.createElement(Column, this._buildColumnContextData(conf), children)
}
BaseTable.prototype._createColumnsVNodes = function () {
  const VNodes = []
  const columns = this.attrs.columns
  for (const conf of columns) {
    const VNode = this._createColumnVNode(conf)
    VNodes.push(VNode)
  }
  return VNodes
}
BaseTable.prototype._buildTableContextData = function() {
  const data = this.getContextData()
  // on
  // 1. change 
  // 如果配置了change事件，给列增加排序事件，通过排序事件触发change
  if (this.on.change) {
    const currentChange = this._bindWithChange(this.on['sort-change'])
    data.on['sort-change'] = currentChange
  }
  // ...
  return data
}
BaseTable.prototype._createTableVNode = function () {
  const Columns = this._createColumnsVNodes()
  // todo  [context.data 应该保持干净]
  return this.createElement(Table, this._buildTableContextData(), Columns)
}
BaseTable.prototype.getChildren = function () {
  const children = []
  // table
  const TableVNode = this._createTableVNode()
  children.push(TableVNode)
  // pagination
  try {
    // 有 total 才插入分页
    if (this.data.attrs.pagination.total) {
      const PaginationVNode = this._createPaginationVNode()
      children.push(PaginationVNode)
    }
  } catch (e) {
    // empty
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