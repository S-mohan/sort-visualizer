import { IRenderHooks, TRenderData } from '../defined'
import Render from '../render'
import RenderHelper from '../helper'
import Sort from './sort'


/**
 * 插入排序
 *
 * @export
 * @class InsertionSort
 * @extends {Sort}
 */
export default class InsertionSort extends Sort {

  static sort(data: TRenderData): TRenderData {
    const size = data.length
    for (let i = 0; i < size; i++) {
      for (let j = i; j > 0 && data[j] < data[j - 1]; j--) {
        RenderHelper.swap(data, j, j - 1)
      }
    }
    return data
  }

  constructor(data: TRenderData, render?: Render, hooks?: IRenderHooks) {
    super(data, render, [
      {
        color: RenderHelper.Colors.Default,
        name: '待排序'
      },
      {
        color: RenderHelper.Colors.Sorted,
        name: '已排序'
      },
      {
        color: RenderHelper.Colors.Current,
        name: '当前值'
      },
      {
        color: RenderHelper.Colors.CurrentCompared,
        name: '当前比较值'
      },
    ], hooks)
  }

  protected *sort(): Generator<Promise<any>> {
    const { data, size } = this

    yield this.draw(0, -1, -1)

    for (let i = 0; i < size; i++) {
      yield this.draw(i, i, - 1)
      for (let j = i; j > 0 && data[j] < data[j - 1]; j--) {
        yield this.draw(i + 1, j, j - 1)
        this.swap(j, j - 1)
        yield this.draw(i + 1, j - 1, -1)
      }

    }

    yield this.draw(size, -1, -1)
  }


  /**
   * 返回每一帧的渲染迭代器，并且在渲染前设置不同的色彩
   *
   * @protected
   * @param {number} sortedIndex
   * @param {number} currentMinIndex
   * @param {number} currentComparedIndex
   * @returns {Promise<any>}
   * @memberof SelectionSort
   */
  protected draw(sortedIndex: number, currentIndex: number, currentComparedIndex: number): Promise<any> {
    return this.render(this.data, (ctx: CanvasRenderingContext2D, index: number) => {
      if (index < sortedIndex) {
        ctx.fillStyle = RenderHelper.Colors.Sorted
      } else {
        ctx.fillStyle = RenderHelper.Colors.Default
      }

      if (index === currentComparedIndex) {
        ctx.fillStyle = RenderHelper.Colors.CurrentCompared
      }

      if (index === currentIndex) {
        ctx.fillStyle = RenderHelper.Colors.Current
      }
    })
  }
}