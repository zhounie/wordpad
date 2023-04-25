
const buttons = document.querySelectorAll('.button')
const editor = document.querySelector('.editor')

// 执行富文本编辑器的命令
function execCommand (command, arg = null) {
  document.execCommand(command, false, arg)
  editor.focus()
}

// 绑定按钮的点击事件
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const command = button.getAttribute('data-command')
    if (command === 'createLink') {
      dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
      // ipcRenderer.invoke('show-dialog', 'Insert Link', 'Enter the URL').then(result => {
      //   if (result.response === 0) {
      //     const url = result.inputValue
      //     execCommand(command, url)
      //   }
      // })
    } else if (command === 'insertImage') {
      document.getElementById('imageUpload').addEventListener('change', function () {
        const file = this.files[0]
        // 读取文件内容并将其转换为base64编码格式
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          execCommand(command, reader.result)
        }
      })
    } else {
      execCommand(command)
    }
  })
})

// 禁用浏览器默认快捷键
editor.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && ['b', 'i', 'u'].includes(event.key)) {
    event.preventDefault()
  }
})

// 处理粘贴操作，只允许纯文本粘贴
editor.addEventListener('paste', event => {
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertHTML', false, text)
})