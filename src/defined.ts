
// 设备像素比
export const DEVICE_PIXEL_RATIO: number = window.devicePixelRatio

// 元素间距（非固定，会在程序中自动调整）
export const ITEM_GAP: number = 10 * DEVICE_PIXEL_RATIO


export const FONT_SIZE: number = 12 * DEVICE_PIXEL_RATIO


// 动画延时
export const ANIMATE_DELAY = 100

// 空函数
export const noop: Function = function () {}

// 渲染数据
export type TRenderData = Array<number>

// Legend项
export interface ILegendItem {
  color: string,
  name: string
}

// Legend项列表
export type TLegendData = Array<ILegendItem>

// 颜色
export interface IColors {
  Default: string
  Sorted: string
  Current: string
  CurrentCompared: string
}

// 钩子名称
export type THooks = 'swap' | 'play' | 'pause' | 'complete'

// 渲染过程中的钩子函数
export interface IRenderHooks {
  swap?: Function
  play?: Function
  pause?: Function
  complete?: Function
}
