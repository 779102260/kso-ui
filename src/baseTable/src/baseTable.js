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

const config = {
  columns: Array, // 列
  pagination: Object, // 分页,
  change: Function // 排序 切换页 切
}
/**
 *
 */
function BaseTable(createElement, context) {
  this.createElement = createElement
  this.context = context
  this.props = this.context.props
  this.attrs = this.context.attrs
  // 改变
  this.changeInfo = {
    pageNumber: 1,
    pageSize: 10,
    sortName: '',
    sortOrder: ''
  }
}
// 使原函数与change事件一起被调用
BaseTable.prototype.bindWithChange = function(fn) {
  return () => {
    fn && fn()
    this.props.change()
  }
}
BaseTable.prototype.createColumnsVNodes = function () {
  const VNodes = []
  const columns = this.context.props.columns
  for (const conf of columns) {
    const VNode = this.createColumnVNode(conf)
    VNodes.push(VNode)
  }
  return VNodes
}
BaseTable.prototype.createColumnVNode = function (conf) {
  const data = this.buildColumnContextData()
  // todo
  const children = []
  return this.createElement(Column, data, children)
}
BaseTable.prototype.buildColumnContextData = function(conf) {
  // attrs
  let attrs = {
    ...conf
  }
  // 1. change 
  // 如果配置了change事件，给列增加排序事件，通过排序事件触发change
  if (this.props.change) {
    const currentChange = this.bindWithChange(this.attrs['current-change'])
    attrs['current-change'] = currentChange
  }
  return { attrs }
}
BaseTable.prototype.createPaginationVNode = function () {
  const conf = this.context.props.pagination
  const attrs = {
    ...conf
  }
  // todo
  const children = []
  return this.createElement(Pagination, { attrs }, children)
}
BaseTable.prototype.createTableVNode = function () {
  const Columns = this.createColumnsVNodes()
  // todo  [context.data 应该保持干净]
  return this.createElement(Table, this.context.data, Columns)
}

export default {
  functional: true,
  name: 'base-table',
  props: config,
  render(createElement, context) {
    const proto = new BaseTable(context.parent.$createElement, context)
    const children = []
    // table
    const TableVNode = proto.createTableVNode()
    children.push(TableVNode)
    // pagination
    if (context.props.pagination && context.props.pagination.total) {
      const PaginationVNode = proto.createPaginationVNode()
      children.push(PaginationVNode)
    }
    return context.parent.$createElement('div', {}, children)
  }
}
export { BaseTable }