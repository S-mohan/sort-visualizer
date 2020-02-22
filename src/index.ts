import Render from './render'
import SelectionSort from './sorts/selection'
import './style.css'

const testData:Array<number> = []

const genRandom = (min:number, max:number) => Math.floor(Math.random() * (max - min) + min)

Array(20).fill(null).map((value, index) => {
  testData[index] = genRandom(500, 1)
})

console.log(testData)

const $canvas: HTMLElement = document.getElementById('canvas')
const renderInstance = new Render($canvas as HTMLCanvasElement)

const selectionSortInstance = new SelectionSort(testData, renderInstance)
// console.log(selectionSortInstance)
// selectionSortInstance.play()

document.getElementById('nextFrame').addEventListener('click', function () {
  selectionSortInstance.next()
})