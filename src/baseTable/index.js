import BaseTable from './src/baseTable.js'

BaseTable.install = function (Vue) {
  Vue.component(BaseTable.name, BaseTable)
}

export default BaseTable
