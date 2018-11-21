/**
 * 最好不要编辑该文件
 */
import main from './main.vue';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(main.name + (main.version || '1.0.0').split('.').join('-'), main);
}