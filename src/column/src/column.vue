<script>
import Proto from '@/kso/proto.js'
import { TableColumn } from 'element-ui'

const config = {
  slot: Function
}
/**
 *
 */
function Column(createElement, context, config) {
  Proto.call(this, 'column', createElement, context, config)
  this.defaultProps = {
    sortable: true
  }
}
Column.prototype = new Proto()
Column.prototype.constructor = Column

export default {
  functional: true,
  name: 'kso-column',
  props: config,
  render(createElement, context) {
    const ist = new Column(createElement, context, config)
    return context.parent.$createElement(TableColumn, ist.getContextData(), ist.getChildren())
  }
}
export { Column }
</script>
