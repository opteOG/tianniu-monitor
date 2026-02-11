import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

import { init } from '@tianniu-monitor/browser'
const monitoring = init({
  dsn: 'http://localhost:3000/tracing/fewjonqks',
  integrations: [],
  watchWhiteScreen: true
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

/**
 * 模拟各种错误类型，用于测试错误监控功能
 */
function simulateErrors() {
  // 1. 运行时错误 - 访问未定义的属性
  function triggerRuntimeError() {
    const obj: any = undefined
    console.log(obj.property.nested) // TypeError: Cannot read property 'nested' of undefined
  }

  // 2. 类型错误
  function triggerTypeError() {
    const num: number = 123
    ;(num as any).toUpperCase() // TypeError: toUpperCase is not a function
  }

  // 4. 范围错误
  function triggerRangeError() {
    const arr = new Array(-1) // RangeError: Invalid array length
  }

  // 5. 语法错误（注释掉，因为会导致编译失败）
  // function triggerSyntaxError() {
  //   eval('const x = {'); // SyntaxError: Unexpected end of input
  // }

  // 6. 异步错误
  function triggerAsyncError() {
    setTimeout(() => {
      throw new Error('异步错误 - setTimeout中的异常')
    }, 100)
  }

  // 7. Promise未捕获的拒绝
  function triggerPromiseRejection() {
    Promise.reject(new Error('Promise被拒绝 - 未处理的Promise拒绝'))
  }

  // 8. 手动抛出的错误
  function triggerManualError() {
    throw new Error('手动抛出的测试错误 - 用于监控测试')
  }

  // 9. 网络请求错误
  function triggerNetworkError() {
    fetch('https://non-existent-domain-12345.com/api/data').catch(error => {
      console.error('网络请求错误:', error)
    })
  }

  // 10. 资源加载错误
  function triggerResourceError() {
    const img = new Image()
    img.onerror = () => {
      console.error('图片加载失败')
    }
    img.src = 'https://non-existent-domain-12345.com/image.jpg'
  }

  // 创建测试按钮
  const errorButtons = document.createElement('div')
  errorButtons.innerHTML = `
    <div style="margin: 20px; padding: 20px; border: 1px solid #ccc;">
      <h3>错误测试按钮</h3>
      <button onclick="triggerRuntimeError()">运行时错误</button>
      <button onclick="triggerTypeError()">类型错误</button>
      <button onclick="triggerReferenceError()">引用错误</button>
      <button onclick="triggerRangeError()">范围错误</button>
      <button onclick="triggerAsyncError()">异步错误</button>
      <button onclick="triggerPromiseRejection()">Promise拒绝</button>
      <button onclick="triggerManualError()">手动错误</button>
      <button onclick="triggerNetworkError()">网络错误</button>
      <button onclick="triggerResourceError()">资源错误</button>
    </div>
  `
  document.body.appendChild(errorButtons)

  // 将错误函数挂载到window对象，供按钮调用
  ;(window as any).triggerRuntimeError = triggerRuntimeError
  ;(window as any).triggerTypeError = triggerTypeError
  ;(window as any).triggerRangeError = triggerRangeError
  ;(window as any).triggerAsyncError = triggerAsyncError
  ;(window as any).triggerPromiseRejection = triggerPromiseRejection
  ;(window as any).triggerManualError = triggerManualError
  ;(window as any).triggerNetworkError = triggerNetworkError
  ;(window as any).triggerResourceError = triggerResourceError

  console.log('错误测试功能已加载，点击按钮触发不同类型的错误')
}

// 初始化错误测试
simulateErrors()
