import { TLegendData, TRenderData, ANIMATE_DELAY, IColors, IRenderHooks, THooks, noop } from './defined'
import Render from './render'


/**
 * 渲染复制器
 *
 * @export
 * @class RenderHelper
 */
export default class RenderHelper {
  renderInstance: Render
  legends: TLegendData
  autoTimer: NodeJS.Timeout
  isDone: boolean
  isPlaying: boolean
  renderGenerator: Generator<Promise<any>>
  hooks: IRenderHooks

  constructor(render: Render, legends: TLegendData, hooks?: IRenderHooks) {
    this.renderInstance = render
    this.legends = legends
    this.hooks = hooks
    setTimeout(() => {
      this.renderInstance.drawLegend(this.legends)
    }, 10)
  }


  /**
   * 动画执行间隔时间 毫秒
   *
   * @static
   * @type {number}
   * @memberof RenderHelper
   */
  static Delay: number = ANIMATE_DELAY


  /**
   * 用来渲染的颜色配置
   *
   * @static
   * @type {IColors}
   * @memberof RenderHelper
   */
  static Colors: IColors = {
    Default: '#b9ddff',
    Sorted: '#2fc25b',
    Current: '#f04864',
    CurrentCompared: '#facc14'
  }


   /**
   * 数据交换
   *
   * @static
   * @param {TRenderData} data
   * @param {number} a
   * @param {number} b
   * @memberof RenderHelper
   */
  static swap (data: TRenderData, a:number, b: number) {
    const temp = data[a]
    data[a] = data[b]
    data[b] = temp
  }


  /**
   * 渲染
   *
   * @protected
   * @param {TRenderData} data
   * @param {Function} beforeDraw
   * @returns {Promise<any>}
   * @memberof RenderHelper
   */
  protected render(data: TRenderData, beforeDraw: Function):Promise<any> {
    if (!this.renderInstance) {
      return Promise.resolve(true)
    }
    return new Promise(resolve => {
      this.renderInstance.draw(data, beforeDraw)
      resolve(true)
    })
  }


  /**
   * 调用钩子函数
   *
   * @protected
   * @param {THooks} name
   * @memberof RenderHelper
   */
  protected callHook(name: THooks, ...args:any): void {
    let hook: Function = noop
    if (this.hooks && typeof this.hooks[name] === 'function') {
      hook = this.hooks[name]
    }
    hook.call(this, ...args)
  }


  /**
   * 播放动画
   *
   * @memberof RenderHelper
   */
  public play() {
    if (this.isDone) {
      return
    }
    this.callHook('play')
    this.isPlaying = true
    const { renderGenerator } = this
    const { done } = renderGenerator.next()
    if (done) {
      this.isDone = true
      this.pause()
      this.callHook('complete')
      return
    }
    this.autoTimer = setTimeout(() => {
      this.play()
    }, ANIMATE_DELAY)
  }



  /**
   * 暂停动画
   *
   * @memberof RenderHelper
   */
  public pause() {
    this.callHook('pause')
    this.isPlaying = false
    clearTimeout(this.autoTimer)
  }


  /**
   * 播放下一帧
   *
   * @memberof RenderHelper
   */
  public next() {
    if (this.isDone) {
      return
    }
    this.pause()
    this.callHook('play')
    const { renderGenerator } = this
    const { done } = renderGenerator.next()
    this.pause()
    if (done) {
      this.isDone = true
      this.callHook('complete')
    }
  }

}