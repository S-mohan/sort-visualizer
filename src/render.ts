
import { DEVICE_PIXEL_RATIO, FONT_SIZE, TLegendData, TRenderData, ITEM_GAP } from './defined'


/**
 * 主渲染引擎
 *
 * @export
 * @class Render
 */
export default class Render {
  $canvas: HTMLCanvasElement
  $legend: HTMLElement
  ctx: CanvasRenderingContext2D

  /**
   * Creates an instance of Render.
   * @param {HTMLCanvasElement} canvas
   * @memberof Render
   */
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


  /**
   * 绘制 legend
   *
   * @param {TLegendData} legends
   * @memberof Render
   */
  drawLegend(legends: TLegendData) {
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


  /**
   * 绘制主面板
   *
   * @param {TRenderData} data
   * @param {Function} [beforeDraw]
   * @memberof Render
   */
  draw(data: TRenderData, beforeDraw?: Function) {
    const { ctx, $canvas } = this
    const size = data.length
    if (!size) {
      return
    }

    const { width, height } = $canvas
    ctx.clearRect(0, 0, width, height)
    ctx.font = `${FONT_SIZE}px tabular-nums`

    let gap = Math.max(1, ITEM_GAP)
    let perWidth: number = width / size - gap

    if (gap > perWidth) {
      gap = perWidth / 2
      gap = Math.max(1, gap)
      perWidth = width / size - gap
    }

    for (let i = 0; i < size; i++) {
      const value = data[i]
      const x = i * (perWidth + gap) + gap
      const h = value * DEVICE_PIXEL_RATIO
      const y = height - h
      beforeDraw && beforeDraw(ctx, i)
      ctx.fillRect(x, y, perWidth, h)
      // 绘制文本
      const tW:number = ctx.measureText(value.toString()).width
      if (tW < perWidth) {
        
        let fy:number = y + FONT_SIZE * 1.5
        const fx:number = x + (perWidth - tW) / 2
        ctx.fillStyle = 'white'
        if (h <= 1.5 * FONT_SIZE) {
          fy = y - FONT_SIZE * .5
          ctx.fillStyle = 'black'
        }
        ctx.fillText(value.toString(), fx, fy)

      }
    }
  }
}
