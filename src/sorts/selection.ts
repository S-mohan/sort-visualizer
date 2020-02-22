import Render, { RenderHelper } from '../render'

export default class SelectionData extends RenderHelper {
  data: Array<number>
  private size: number

  constructor(data: Array<number>, render?: Render) {
    super(render, [
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
        name: '当前最小值'
      },
      {
        color: RenderHelper.Colors.CurrentCompared,
        name: '当前比较值'
      },
    ])
    this.data = data
    this.size = data.length
    this.reset()
  }

  public sort() {
    const { data, size } = this
    for (let i = 0; i < size; i++) {
      let minIndex = i
      for (let j = i + 1; j < size; j++) {
        if (data[j] < data[minIndex]) {
          minIndex = j
        }
      }
      this.swap(i, minIndex)
    }
    return this.data
  }

  public reset () {
    this.isDone = false
    this.renderGenerator = this.sortWithRender()
    this.renderGenerator.next()
  }

  private *sortWithRender():Generator<Promise<any>> {
    const { data, size } = this
    yield this.draw(0, -1, -1)
    for (let i = 0; i < size; i++) {
      let minIndex = i
      yield this.draw(i, -1, minIndex)
      for (let j = i + 1; j < size; j++) {
        yield this.draw(i, j, minIndex)
        if (data[j] < data[minIndex]) {
          minIndex = j
          yield this.draw(i, j, minIndex)
        }
      }
      this.swap(i, minIndex)
      yield this.draw(i + 1, -1, minIndex)
    }
    yield this.draw(size, -1, -1)
  }

  private draw(sortedIndex: number, currentComparedIndex: number, currentMinIndex: number) {
    return this.render(this.data, (ctx: CanvasRenderingContext2D, index: number) => {
      if (index < sortedIndex) {
        ctx.fillStyle = RenderHelper.Colors.Sorted
      } else {
        ctx.fillStyle = RenderHelper.Colors.Default
      }

      if (index === currentComparedIndex) {
        ctx.fillStyle = RenderHelper.Colors.CurrentCompared
      }

      if (index === currentMinIndex) {
        ctx.fillStyle = RenderHelper.Colors.Current
      }
    })
  }

  private swap(i: number, j: number) {
    const { data } = this
    const temp = data[i]
    data[i] = data[j]
    data[j] = temp
  }

}