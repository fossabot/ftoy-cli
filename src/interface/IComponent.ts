/**
 * 组件接口
 *
 * @export
 * @interface IComponent
 */
export interface IComponent {
  type: string;
  version: string;
  name: string;
  label: string;
  props: { attributes: { default: () => object } };

  _id: string;
  gitname: string;
  regname: string;
  giturl: string;
  path: string;
  attributes: object;
}
