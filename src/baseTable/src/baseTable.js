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
  change: Function
}
/**
 *
 */
function BaseTable(createElement, context) {
  this.createElement = createElement
  this.context = context
  this.changeInfo = {
    pageNumber: 1,
    pageSize: 10,
    sortName: '',
    sortOrder: ''
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
  const attrs = {
    ...conf
  }
  // todo
  const children = []
  return this.createElement(Column, { attrs }, children)
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
  props: {
    // url: String, // 请求数据地址
    // sortChange: Function, // 排序方式
    columns: Array, // 列
    pagination: Object // 分页
  },
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