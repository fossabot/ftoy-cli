module.exports = {
  /**
   *  type     组件类型
   *  version  组件版本
   *  name     组件系统名称
   *  label    组件展示名称
   *  props    组件属性定义
   */
  type: 'title',
  version: '1.0.0',
  name: 'toy-component-test',
  label: 'jest',
  props: {
    attributes: {
      type: Object,
      default: () => ({
        sample: {
          type: 'input-string',
          label: '示例文字',
          value: 'Hello toy!'
        }
      })
    }
  }
};