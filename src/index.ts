import Render from './render'
import SelectionSort from './sorts/selection'
import InsertionSort from './sorts/insertion'
import { IRenderHooks } from './defined'
import './style.css'


type SortInstance = SelectionSort | InsertionSort

const SORT_INSTANCES: Array<SortInstance> = []

// 最小取值
const MIN_NUM = 20
// 最大取值
const MAX_NUM = 260
// 排序数量
const SIZES = 15

const testData: Array<number> = []


// 生成随机数据
const genRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)

const $numbers = document.getElementById('numbers')

// 生成测试数据源
const genTestData = (min: number = MIN_NUM, max: number = MAX_NUM, size: number = SIZES) => {
  testData.length = 0
  const nums: Array<string> = []
  Array(size).fill(null).map((value, index) => {
    testData[index] = genRandom(max, min)
    nums.push(`<li>${testData[index]}</li>`)
  })

  $numbers.innerHTML = nums.join('')
}


const $formSize = document.getElementById('form-size') as HTMLInputElement
const $formMin = document.getElementById('form-min') as HTMLInputElement
const $formMax = document.getElementById('form-max') as HTMLInputElement
const $currentSize = document.getElementById('current-size')
const $currentMin = document.getElementById('current-min')
const $currentMax = document.getElementById('current-max')

// 测试参数更改
{
  $formSize.addEventListener('change', function () {
    const value = this.value
    $currentSize.textContent = value
    updateParams()
  })

  $formMin.addEventListener('change', function () {
    const value = this.value
    if (+value > +$formMax.value) {
      alert('Invalid data')
      this.value = $currentMin.textContent
      return
    }
    $currentMin.textContent = value
    updateParams()
  })

  $formMax.addEventListener('change', function () {
    const value = this.value
    if (+value < +$formMin.value) {
      alert('Invalid data')
      this.value = $currentMax.textContent
      return
    }
    $currentMax.textContent = value
    updateParams()
  })
}


// 更新测试参数
const updateParams = () => {
  genTestData(+$formMin.value, +$formMax.value, +$formSize.value)
  updateCanvas()
}

// 更新画板
const updateCanvas = () => {
  SORT_INSTANCES.forEach((instance: SortInstance) => instance.updateData(testData))
}

// 刷新测试数据
{
  let updateTimer = false
  document.getElementById('refreshTestData').addEventListener('click', function () {
    if (updateTimer) {
      return
    }
    this.setAttribute('disabled', '')
    updateTimer = true
    updateParams()
    // 放置频繁触发
    setTimeout(() => {
      updateTimer = false
      this.removeAttribute('disabled')
    }, 400)
  })
}


const init = () => {
  $formSize.value = String(SIZES)
  $formMin.value = String(MIN_NUM)
  $formMax.value = String(MAX_NUM)
  $currentSize.textContent = String(SIZES)
  $currentMin.textContent = String(MIN_NUM)
  $currentMax.textContent = String(MAX_NUM)
  genTestData()
  initSorts()
}


const initSorts = () => {
  const $sorts = document.querySelectorAll('.js-sort')

  Array.from($sorts).forEach(($sort: HTMLElement) => {
    const sortType = $sort.dataset.sortType
    const $canvas = $sort.querySelector('canvas') as HTMLCanvasElement
    const renderInstance = new Render($canvas)
    const $playBtn = $sort.querySelector('.js-play')
    const $nextBtn = $sort.querySelector('.js-next')
    let sortInstance: SortInstance

    const hooks: IRenderHooks = {
      swap(a: number, b: number) {
        console.log(a, b)
      },
      play() {
        $playBtn.textContent = '暂停'
        $nextBtn.setAttribute('disabled', 'disabled')
      },
      pause() {
        $playBtn.textContent = '播放'
        $nextBtn.removeAttribute('disabled')
      },
      complete() {
        $playBtn.textContent = '重播'
        $nextBtn.setAttribute('disabled', 'disabled')
      }
    }

    switch (sortType) {
      case 'selection':
        sortInstance = new SelectionSort(testData, renderInstance, hooks)
        break
      case 'insertion':
        sortInstance = new InsertionSort(testData, renderInstance, hooks)
      default:
        break
    }


    $playBtn.addEventListener('click', () => {
      if (sortInstance.isDone) {
        sortInstance.reset()
        sortInstance.play()
        return
      }
      if (sortInstance.isPlaying) {
        sortInstance.pause()
      } else {
        sortInstance.play()
      }
    })

    $nextBtn.addEventListener('click', () => {
      sortInstance.next()
    })

    console.log(sortInstance)

    SORT_INSTANCES.push(sortInstance)
  })

  // console.log(InsertionSort.sort(testData))
}

init()