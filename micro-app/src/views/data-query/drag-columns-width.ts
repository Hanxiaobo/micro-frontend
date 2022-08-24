/* eslint-disable indent */
import { ref } from 'vue'

const getTextWidth = (str: string) => {
  let width = 0
  const html = document.createElement('span')
  html.style.display = 'inline-block'
  // html.style.fontSize = '12px'
  html.innerText = str
  html.className = 'getTextWidth'
    ; (window as any).document.querySelector('body').appendChild(html)
  width = (window as any).document.querySelector('.getTextWidth').clientWidth
    ; (window as any).document.querySelector('.getTextWidth').remove()
  return width
}
function useDragWidth(props: any) {
  const startPosition = ref()
  const targetDom: any = ref()
  const showLine = ref(0)
  const toggleTable = ref(true)
  const newColumns: any = ref([])

  const resetColumns = (key: string, w: number) => {
    toggleTable.value = false
    const list = props.item.columnNameList || []
    const arr: any = []
    list.forEach((c: any, index: number) => {
      const width = props.item.columnObj && props.item.columnObj[index]
      const obj = {
        key: `${index}`,
        dataKey: `${index}`,
        title: `${c}`,
        width: width
      }

      if (c === key && targetDom.value.dataset.key * 1 === index) {
        obj.width = w
        if (props.item.columnObj) { // 存放拖拽后的宽度
          props.item.columnObj[index] = w
        } else {
          props.item.columnObj = { [index]: w }
        }
      }
      arr.push(obj)
    })
    newColumns.value = arr
    // sessionStorage.setItem(props.item.jobId + 'cWidth', JSON.stringify(arr))
    toggleTable.value = true
  }
  const updateTable = () => {
    resetColumns('', 0)
  }
  const tableLeft = ref(0)
  const onMousedown = (e: any) => {
    let tableV2: any = null
    if (e.path[0].className === 'el-table-v2__header-cell') {
      startPosition.value = e.clientX
      targetDom.value = e.path[0]
      tableV2 = e.path[7]
    }
    if (e.path[0].className === 'el-table-v2__header-cell-text') {
      startPosition.value = e.clientX
      targetDom.value = e.path[1]
      tableV2 = e.path[8]
    }
    if (tableV2) {
      tableLeft.value = tableV2.getBoundingClientRect().left
      const columnRect = targetDom.value.getBoundingClientRect()
      showLine.value = columnRect.right - tableLeft.value
    }
  }
  const onMouseMove = (e: any) => {
    if (targetDom.value) {
      showLine.value = e.clientX - tableLeft.value
    }
  }
  const onMouseUp = (e: any) => {
    if (targetDom.value) {
      const moveLength = e.clientX - startPosition.value
      resetColumns(targetDom.value.innerText, targetDom.value.offsetWidth + moveLength)
      targetDom.value = null
      showLine.value = 0
    }
  }
  return {
    showLine,
    toggleTable,
    newColumns,
    onMousedown,
    onMouseMove,
    onMouseUp,
    getTextWidth,
    updateTable
  }
}

export default useDragWidth
