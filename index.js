import Table from './src/table/index.js'
import Column from './src/column/index.js'
import Pagination from './src/pagination/index.js'
import KsoBaseTable from './src/baseTable/index.js'

const components = { KsoTable: Table, KsoColumn: Column, KsoPagination: Pagination, KsoBaseTable }

const install = function (Vue, options) {
  for (const key in components) {
    const component = components[key]
    Vue.component(component.name, component)
  }
}

export default { version: '2.0.2', install, ...components }
