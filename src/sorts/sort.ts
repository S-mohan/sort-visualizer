import { IRenderHooks, TRenderData, TLegendData } from '../defined'
import Render from '../render'
import RenderHelper from '../helper'


export default abstract class Sort extends RenderHelper {

  /**
   * 渲染数据
   *
   * @private
   * @type {TRenderData}
   * @memberof Sort
   */
  protected data: TRenderData


  /**
   * 数据源
   *
   * @private
   * @type {TRenderData}
   * @memberof Sort
   */
  private source: TRenderData


  /**
   * 获取当前渲染数据的长度
   *
   * @readonly
   * @memberof Sort
   */
  get size() {
    return this.data.length
  }


  constructor(data: TRenderData, render: Render, legends?: TLegendData, hooks?: IRenderHooks) {
    super(render, legends, hooks)
    this.updateData(data)
  }

  /**
   * 生成渲染所需的遍历器对象
   * 
   * 由子类实现
   *
   * @private
   * @returns {Generator<Promise<any>>}
   * @memberof Sort
   */
  protected *sort(): Generator<Promise<any>> { }


  /**
   * 返回每一帧的渲染迭代器，并且在渲染前设置不同的色彩
   * 
   * 由子类实现
   *
   * @private
   * @returns {Generator<Promise<any>>}
   * @memberof Sort
   */
  protected abstract draw(...agrs:Array<number>): Promise<any>

  
  /**
   * 数据交换
   *
   * @private
   * @param {number} i
   * @param {number} j
   * @memberof SelectionData
   */
  protected swap(i: number, j: number): void {
    RenderHelper.swap(this.data, i, j)
    this.callHook('swap', i, j)
  }


  /**
  * 重置渲染迭代器
  *
  * @memberof SelectionData
  */
  public reset(): void {
    this.isDone = false
    this.data = [...this.source]
    this.renderGenerator = this.sort()
    this.renderGenerator.next()
  }


  /**
   * 更新数据源
   *
   * @param {TRenderData} data
   * @memberof SelectionData
   */
  public updateData(data: TRenderData): void {
    this.data = [...data]
    this.source = [...data]
    this.reset()
  }

}