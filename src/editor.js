const bootstrap = require('bootstrap')
const $ = require('jquery')
const { dialog } = require('@electron/remote')
const buttons = document.querySelectorAll('.button')
const editor = document.querySelector('.editor')
editor.focus()
const myModal = new bootstrap.Modal('#staticBackdrop', {
  keyboard: false
})

const range = window.getSelection()

function onFocus () {
  editor.focus()
  range.selectAllChildren(editor)
  range.collapseToEnd()
}



// 执行富文本编辑器的命令
function execCommand (command, arg = null) {
  document.execCommand(command, false, arg)
  console.log(command);
  if (command === 'insertImage') {
    onFocus()
  }
}

// 绑定按钮的点击事件
buttons.forEach(button => {
  const command = button.getAttribute('data-command')

  if (command === 'foreColor') {
    document.getElementById('myColor').addEventListener('change', function(e) {
      execCommand(command, e.target.value)
    })
  } else if (command === 'hiliteColor') {
    document.getElementById('bgColor').addEventListener('change', function(e) {
      execCommand(command, e.target.value)
    })
  } else if (
    command === 'fontSize' ||
    command === 'fontName' ||
    command === 'indent' ||
    command === 'lineHeight'
  ) {
    button.addEventListener('change', (e) => {
      execCommand(command, e.target.value)
      // const command = button.getAttribute('data-command')
      // if (command === 'createLink') {
      //   myModal.show()
      // } else if (command === 'insertImage') {
      //   document.getElementById('imageUpload').addEventListener('change', function () {
      //     const file = this.files[0]
      //     // 读取文件内容并将其转换为base64编码格式
      //     const reader = new FileReader()
      //     reader.readAsDataURL(file)
      //     reader.onload = function () {
      //       execCommand('insertHTML', `<img src='${reader.result}' style='max-width: 200px; display: inline-block' />`)
      //     }
      //   })
      // } else {
      //   execCommand(command)
      // }
    })
    return
  } else if (command == 'insertImage') {
    button.addEventListener('click', appendImage)
  } else if (command === 'createLink') {
    button.addEventListener('click', appendLink)
  } else {
    button.addEventListener('click', () => {
      execCommand(command)
    }) 
  }
})

function appendImage() {
  console.log(214124214);
  document.getElementById('imageUpload').addEventListener('change', createImage)
}

function createImage() {
  const file = this.files[0]
  // 读取文件内容并将其转换为base64编码格式
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    onFocus()
    execCommand('insertHTML', onGenImg(reader.result))
  }
}

function appendLink() {
  myModal.show()
}

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

function onGenImg (src) {
  const time = new Date().getTime()
  return `
  <img src='${src}' style='width: 100px'  />
  `
}


// <p id="${time}" style="width: 200px" class="img-box">
//   <img src='${src}' style='width: 100%'  />
//   <span id="tl" class="tl"
//     onmousedown="onDown(event, ${time})"
//     onmousemove="onMouseMoveLeft(event)"
//   ></span>
//   <span id="tr" class="tr"
//     onmousedown="onDown(event, ${time})"
//     onmousemove="onMouseMove(event)"
//   ></span>
//   <span class="bl"
//     onmousedown="onDown(event, ${time})"
//     onmousemove="onMouseMoveLeft(event)"
//   ></span>
//   <span class="br"
//     onmousedown="onDown(event, ${time})"
//     onmousemove="onMouseMove(event)"
//   ></span>
// </p>
// <span data-slate-node="text"></span>


function onConfirmUrl() {
  let url = $('#recipient-name').val()
  if (url) {
    onFocus()
    execCommand('createLink', url)
  }
  $('#recipient-name').val('')
  myModal.hide()
}

function onChangeColor(e) {
  execCommand(command, e.target.value)
}



let imgBox = ''
let imgWidth = ""
let action = false

function onMouseUp () {
  action = false
  window.removeEventListener("mouseup", onMouseUp)
}

function onDown (e, id) {
  window.addEventListener("mouseup", onMouseUp)
  imgBox = document.getElementById(id)
  imgWidth = imgBox.clientWidth
  action = true
}
function onMouseMove (e) {
  if (!action) return 
  // console.log((imgBox.clientWidth - (start - e.x)) + 'px');
  imgBox.style.width = (imgWidth - (imgWidth - e.x)) + 'px'
}
function onMouseMoveLeft (e) {
  if (!action) return 
  // console.log((imgBox.clientWidth - (start - e.x)) + 'px');
  imgBox.style.width = (imgWidth - (e.x)) + 'px'
}

