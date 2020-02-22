type RenderData = Array<number>

interface ILegendItem {
  color: string,
  name: string
}

type legendData = Array<ILegendItem>

// 设备像素比
const DEVICE_PIXEL_RATIO: number = window.devicePixelRatio

// 元素间距（非固定，会在程序中自动调整）
const ITEM_GAP: number = 10 * DEVICE_PIXEL_RATIO

// 动画延时
const ANIMATE_DELAY = 100


export default class Render {
  $canvas: HTMLCanvasElement
  $legend: HTMLElement
  ctx: CanvasRenderingContext2D
  constructor(canvas: HTMLCanvasElement) {
    const $legend = document.createElement('div')
    $legend.className = 'legends'
    this.$canvas = canvas
    this.$legend = $legend
    const $parent = canvas.parentNode as HTMLElement
    const styles = window.getComputedStyle(canvas, null)
    const width = parseInt(styles.width, 10) || $parent.offsetWidth
    const height = parseInt(styles.height, 10) || $parent.offsetHeight
    $parent.appendChild($legend)
    canvas.width = width * DEVICE_PIXEL_RATIO
    canvas.height = height * DEVICE_PIXEL_RATIO
    canvas.style.cssText += `width:${width}px; height:${height}px;`
    this.ctx = canvas.getContext('2d')
  }

  drawLegend(legends: legendData) {
    const { $legend } = this
    const htmls = []
    for (let i = 0, len = legends.length; i < len; i++) {
      const legend = legends[i]
      htmls.push(`<div class="legend">
        <span class="rect" style="background:${legend.color}"></span>
        <span class="text">${legend.name}</span>
      </div>`)
    }
    $legend.innerHTML = htmls.join('')
  }


  draw(data: RenderData, beforeDraw?: Function) {
    const { ctx, $canvas } = this
    const size = data.length
    if (!size) {
      return
    }

    const { width, height } = $canvas
    ctx.clearRect(0, 0, width, height)

    let gap = Math.max(1, ITEM_GAP)
    let perWidth: number = width / size - gap

    if (gap > perWidth) {
      gap = perWidth / 2
      gap = Math.max(1, gap)
      perWidth = width / size - gap
    }

    for (let i = 0; i < size; i++) {
      const item = data[i]
      const x = i * (perWidth + gap) + gap
      const h = item * DEVICE_PIXEL_RATIO
      const y = height - h
      beforeDraw && beforeDraw(ctx, i)
      ctx.fillRect(x, y, perWidth, h)
    }
  }
}

interface IColors {
  Default: string
  Sorted: string
  Current: string
  CurrentCompared: string
}


export class RenderHelper {
  renderInstance: Render
  legends: legendData
  autoTimer: NodeJS.Timeout
  isDone: boolean
  renderGenerator: Generator<Promise<any>>


  constructor(render: Render, legends: legendData) {
    this.renderInstance = render
    this.legends = legends
    setTimeout(() => {
      this.renderInstance.drawLegend(this.legends)
    }, 10)
  }

  static Delay: number = ANIMATE_DELAY

  static Colors: IColors = {
    Default: '#AAAAAA',
    Sorted: '#6bc30d',
    Current: '#FF6600',
    CurrentCompared: '#2B74E6'
  }

  protected render(data: Array<number>, beforeDraw: Function) {
    if (!this.renderInstance) {
      return Promise.resolve(true)
    }
    return new Promise(resolve => {
      this.renderInstance.draw(data, beforeDraw)
      resolve(true)
    })
  }


  public play () {
    if (this.isDone) {
      return
    }
    const {renderGenerator} = this
    const { done } = renderGenerator.next()
    if (done) {
      this.isDone = true
      this.pause()
      return
    }
    this.autoTimer = setTimeout(() => {
      this.play()
    }, ANIMATE_DELAY)
  }

  public pause () {
    clearTimeout(this.autoTimer)
  }

  public next () {
    if (this.isDone) {
      return
    }
    this.pause()
    const {renderGenerator} = this
    const { done } = renderGenerator.next()
    if (done) {
      this.isDone = true
    }
  }





}