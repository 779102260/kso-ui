import BaseTable from './src/baseTable.vue'

BaseTable.install = function (Vue) {
  Vue.component(BaseTable.name, BaseTable)
}

export default BaseTable
