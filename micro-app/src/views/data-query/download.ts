import { ref } from 'vue'

function useDownload() {
  const loadingButtons: any = ref([])
  const downloadFn = (id: string) => {
    loadingButtons.value.push(id)
    var url = '?jobId=' + id
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      const blob = xhr.response
      // if (blob.flag === 'F') {
      //   ElMessage({
      //     message: blob.msg,
      //     type: 'error'
      //   })
      //   return
      // }
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function () {
        const url = URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        document.body.appendChild(a) // 此处增加了将创建的添加到body当中
        a.href = url
        const headerContent = decodeURI(xhr.getResponseHeader('content-disposition') || '')
        const currentId = xhr.getResponseHeader('jobid') || ''
        const arr = headerContent.split(';')
        let fileName = '文件名称名称.xlsx'
        arr.forEach((str) => {
          if (str.startsWith('filename')) {
            fileName = str.split('=')[1]
          }
        })
        a.download = fileName
        a.target = '_blank'
        a.click()
        a.remove() // 将a标签移除
        loadingButtons.value.forEach((cid: string, index: number) => {
          if (cid === currentId) {
            loadingButtons.value.splice(index, 1)
          }
        })
      }
    }
    xhr.onerror = function () {
      loadingButtons.value = []
      console.error('could not download file')
    }
    xhr.send()
  }
  return {
    downloadFn,
    loadingButtons
  }
}

export default useDownload
