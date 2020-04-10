import { copy, merge, isObject } from 'kso-util' 

function spread(target, obj) {
  if (!isObject(obj)) {
    return
  }
  for (const key in obj) {
    if (!isObject(obj[key])) {
      continue
    }
    target[key] = obj[key]
  }
}

// 所有插件统一配置项
const unitConfig = {
  class: {},
  style: {},
  attrs: {
    slot: Function // attr.slot 将被解析到 scopedSlots
  },
  props: {},
  domProps: {},
  on: {},
  nativeOn: {},
  directives: [],
  scopedSlots: {} // scopedSlots.default 可能被 attr.slot 覆盖
}
/**
 *
 * @param {Fn} createElement
 * @param {Object} context
 * @param {Object} config 插件自定义配置项
 */
function Proto(name, createElement, context, config) {
  this.createElement = createElement
  this.context = context
  this.config = merge({}, unitConfig, config)
  // 处理data
  this.data = copy(context.data)
  spread(this, this.data) // 批量从data上复制属性到当前对象（只复制值是对象的属性）
  this.initData(this.data) // 根据自定义配置处理data
  // 处理子节点
  this.children = context.children
  // 默认配置项
  this.defaultData = {
    class: {
      [`kso-${name}`]: true
    },
    style: {},
    attrs: {},
    props: {},
    domProps: {},
    on: {},
    nativeOn: {},
    directives: [],
    scopedSlots: {}
  }
}
/**
 * 继承
 */
Proto.prototype.inheirt = function(obj) {
  const Fn = function() {}
  Fn.prototype = obj.prototype
  return new Fn()
}
/**
 * context.data在被使用前，可以先进行处理
 */
Proto.prototype.initData = function(data) {
  this.initScopeSlots(data)
}
Proto.prototype.initScopeSlots = function(data) {
  if (data.scopedSlots === undefined) {
    data.scopedSlots = {}
  }
  // 将 slot 配置，移到scopedSlots.default
  // todo 支持多个 slot
  try {
    const slot = this.attrs.slot
    if (slot) {
      data.scopedSlots.default = slot
    }
  } catch (e) {
    // empty
  }
}
/**
 * 获取contextData，保持干净
 * defaultData + 传入的 data - 自定义 config 
 */
Proto.prototype.getContextData = function () {
  // 合并 defaultData + 传入的 data
  let data = merge({}, this.defaultData, this.data)
  // 过滤自定义 config 
  for (const key in data) {
    data[key] = this.filterByConfig(data[key], this.config[key])
  }
  return data
}
/**
 * 获取子节点
 */
Proto.prototype.getChildren = function () {
  return this.children
}
/**
 * 将data中包含的config配置项都删掉（深层对比）
 */
Proto.prototype.filterByConfig = function(data, conf) {
  if (conf === undefined) {
    return data
  }
  const copyData = { ...data }
  for (const key in copyData) {
    if (conf[key] === undefined) {
      continue
    }
    const item = copyData[key]
    if (isObject(item)) {
      // 深层配置，递归
      copyData[key] = this.filterByConfig(item, conf[key])
    } else {
      delete copyData[key]
    }
  }
  return copyData
}

export default Proto
