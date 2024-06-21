import Vue from 'vue'

const result = require('~/assets/json/settings.json') // 拉取 settings.json

const $settings = {
  getRootSettingsType () { // 获取根设置项列表
    const typesArray = result.types
    for (let i = 0; i < typesArray.length; i++) {
      typesArray[i].key = i // 为每个项都添加对应的 Key, 用于 v-for 排列
      typesArray[i].isShow = true
      typesArray[i].isDisabled = false
      // 设置项显示条件判断
      if (typesArray[i].showCondition) { // 则存在条件要求
        const showCondition = typesArray[i].showCondition
        typesArray[i].isShow = this.determineCondition(showCondition.type, showCondition.source, showCondition.destination) // 是否显示设置项
      }
      // 结束显示条件判断
      // 设置项禁用条件判断
      if (typesArray[i].disableCondition) { // 则存在条件要求
        const disableCondition = typesArray[i].disableCondition
        typesArray[i].isDisabled = this.determineCondition(disableCondition.type, disableCondition.source, disableCondition.destination) // 是否禁用设置项
      }
      // 结束禁用条件判断
    }
    return typesArray
  },
  getExactSettings (_data) { // 获取精确设置项值
    // To Be Done
  },
  getSubTypeSettings (_type) { // 获取子设置项列表
    // To Be Done
  },
  determineCondition (conditionType, source, destination) {
    // 判断条件符合情况  conditionType --> 判断类型  source --> 判断源  destination --> 目标值
    const allowedConditionType = ['isEqual', 'isIn']
    if (!allowedConditionType.includes(conditionType)) {
      throw new TypeError('The argument "conditionType" in function DCE.Plugins.Settings.determineCondition ' +
        'expected to be one of [' + allowedConditionType.toString() + ']. But received ' + conditionType + '.')
    }
    switch (conditionType) {
    case 'isEqual':
      return destination === this.getExactSettings(source)
    case 'isIn':
      return this.getExactSettings(source).includes(destination)
    default:
      throw new Error('Function DCE.Plugins.Settings.determineCondition occurred an' +
        'unexpected error: switch case conditionType not handled.')
    }
  }
}

const loadSettingsUtils = {
  install (Vue) {
    Vue.prototype.$settings = $settings // 挂载至 this.$settings
  }
}

Vue.use(loadSettingsUtils)
