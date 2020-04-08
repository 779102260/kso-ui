/**
 *
 * @param {Fn} createElement
 * @param {Object} context
 * @param {Object} config 插件自定义配置项
 */
function Proto(name, createElement, context, config) {
  this.createElement = createElement
  this.context = context
  this.attrs = context ? context.data.attrs : {}
  this.config = config
  // 默认配置项
  this.defaultClass = {
    [`kso-${name}`]: true
  }
  this.defaultStyle = {}
  this.defautlAttrs = {}
  this.defaultProps = {}
  this.defaultDomProps = {}
  this.defaultOn = {}
  this.defaultNativeOn = {}
  this.defaultDirectives = []
  this.defautlScopedSlots = {}
  // 自定义事件列表（根据这个列表从配置项中提取）
  this.eventList = []
}
Proto.prototype._buildClass = function () {
  return {
    ...this.defaultClass
  }
}
Proto.prototype._buildStyle = function () {
  return {
    ...this.defaultStyle
  }
}
Proto.prototype._buildAttrs = function () {
  const rAttrs = {}
  // todo 根据各种build返回值，自动去除这些属性
  // 从attrs中删除本插件attr和事件等，保持干净
  // - 删除本插件（config）项
  // - 删除事件项
  const configKeys = Object.keys(this.config)
  for (const key in this.attrs) {
    if (!configKeys.includes(key) && !this.eventList.includes(key)) {
      rAttrs[key] = this.attrs[key]
    }
  }
  return rAttrs
}
// 构建完整的props
Proto.prototype._buildProps = function () {
  return {
    ...this.defaultProps
  }
}
Proto.prototype._buildDomProps = function () {
  return {
    ...this.defaultDomProps
  }
}
Proto.prototype._buildOn = function () {
  const on = {
    ...this.defaultOn
  }
  for (const key in this.attrs) {
    if (this.eventList.includes(key)) {
      on[key] = this.attrs[key]
    }
  }
  return on
}
Proto.prototype._buildNativeOn = function () {
  return {
    ...this.defaultNativeOn
  }
}
Proto.prototype._buildDirectives = function () {
  return [...this.defaultDirectives]
}
Proto.prototype._buildScopedSlots = function () {
  const scopeSlot = {}
  const slot = this.context.props.slot
  if (slot) {
    scopeSlot.default = slot
  }
  return {
    ...this.defaultScopedSlots,
    ...scopeSlot
  }
}
Proto.prototype.getContextData = function () {
  const classess = this._buildClass()
  const style = this._buildStyle()
  const attrs = this._buildAttrs()
  const props = this._buildProps()
  const domProps = this._buildDomProps()
  const on = this._buildOn()
  const nativeOn = this._buildNativeOn()
  const directives = this._buildDirectives()
  const scopedSlots = this._buildScopedSlots()
  return {
    class: classess,
    style,
    attrs,
    props,
    domProps,
    on,
    nativeOn,
    directives,
    scopedSlots
  }
}
Proto.prototype.getChildren = function () {
  return this.context.children
}

export default Proto
