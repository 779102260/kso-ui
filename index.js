import Table from './src/table/index.js'
import Column from './src/column/index.js'
import Pagination from './src/pagination/index.js'
import BaseTable from './src/baseTable/index.js'

const components = { KsoTable: Table, KsoColumn: Column, KsoPagination: Pagination, BaseTable }

const install = function (Vue, options) {
  for (const key in components) {
    const component = components[key]
    Vue.component(component.name, component)
  }
}

export default { version: '1.0.0', install, ...components }
