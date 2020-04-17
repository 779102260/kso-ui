import { merge, isObject } from 'kso-util'

/**
 *
 * @param {*} target
 * @param {*} obj
 */
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

/**
 *
 * @param {Fn} createElement
 * @param {Object} context
 * @param {Object} config 插件自定义配置项，可能是深层对象，为了区分，自定义属性以_开头
 */
function Proto(name, createElement, context, config) {
  this.name = name
  this.createElement = createElement
  this.context = context
  // 默认
  this.defaultData = {}
  // 初始化
  this.beforeInit() // 事件
  this.config = this.initConfig(config)

  this.beforeInitData() // 事件
  this.data = this.initData(context.data)
  spread(this, this.data) // 批量从data上复制属性到当前对象（只复制值是对象的属性）
  this.afterInitData() // 事件

  this.children = this.initChildren(context.children)
  this.afterInit() // 事件
}
Proto.prototype.getUnitDefaultConfig = function () {
  return {
    // 所有插件默认配置项
    class: {},
    style: {},
    attrs: {},
    props: {},
    domProps: {},
    on: {},
    nativeOn: {},
    directives: [],
    scopedSlots: {} // scopedSlots.default 可能被 attr.slot 覆盖
  }
}
Proto.prototype.getUnitDefaultData = function () {
  return {
    // 所有插件默认数据对象
    class: {
      [`kso-${this.name}`]: true
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
Proto.prototype.beforeInit = function () {}
Proto.prototype.initConfig = function (config) {
  return merge({}, this.getUnitDefaultConfig(), config)
}
Proto.prototype.beforeInitData = function () {}
Proto.prototype.initData = function (data) {
  return merge({}, this.getUnitDefaultData(), data)
}
Proto.prototype.afterInitData = function () {}
Proto.prototype.initChildren = function (children) {
  return children
}
Proto.prototype.afterInit = function () {}
/**
 * 获取数据对象，保持干净
 * defaultData + 传入的 data - 自定义 config
 */
Proto.prototype.getData = function () {
  // 合并 defaultData + 传入的 data
  const data = merge({}, this.defaultData, this.data)
  // 过滤自定义 config
  for (const key in this.config) {
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
Proto.prototype.filterByConfig = function (data, conf) {
  if (conf === undefined) {
    return data
  }
  const copyData = { ...data }
  for (const key in conf) {
    const realKey = key.slice(1)
    const item = copyData[realKey]
    const confItem = conf[key]
    if (!item) {
      continue
    }
    if (key[0] === '_') {
      delete copyData[realKey]
    } else {
      // 深层配置，递归
      copyData[realKey] = this.filterByConfig(item, confItem)
    }
  }
  return copyData
}
/**
 * 继承
 */
Proto.prototype.inheirt = function (obj) {
  const Fn = function () {}
  Fn.prototype = obj.prototype
  return new Fn()
}
/**
 * 安全设值对象kv，可以是深层对象，新值默认与原值进行合并的（replace true则替换）
 * this.$set(data, 'pagination.on.current-change', currentChange)
 */
Proto.prototype.$set = function (obj, key, value, replace) {
  if (typeof obj !== 'object' || typeof key !== 'string' || value === undefined) {
    console.error('$set 参数错误', obj, key, value)
  }
  const keys = key.split('.')
  let v = obj
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    if (i === keys.length - 1) {
      if (replace) {
        v[k] = value
      } else {
        v[k] = isObject(v[k]) ? merge({}, v, value) : value
      }
      return
    }
    if (v[k] === undefined) {
      v[k] = {}
    }
    v = v[k]
  }
}
Proto.prototype.$get = function (obj, key) {
  if (typeof obj !== 'object' || typeof key !== 'string') {
    console.error('$get 参数错误', obj, key, value)
  }
  const keys = key.split('.')
  let value = obj
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    value = value[k]
    if (value === undefined) {
      break
    }
  }
  return value
}
export default Proto
