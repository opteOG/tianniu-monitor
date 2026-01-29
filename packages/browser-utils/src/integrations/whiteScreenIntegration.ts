import { Transport } from '@tianniu-monitor/monitor-core'

// 白屏监控插件
export class whiteScreenIntegration {
  constructor(private transport: Transport, private whiteBoxElements: string[] = ['html', 'body', '#app', '#root']) {}

  // 初始化白屏监控
  init() {
    if (document.readyState === 'complete') {
      this.sample()
    } else {
      window.addEventListener('load', () => {
        this.sample()
      })
    }
  }
  // 采样对比
  private sample() {
    let emptyPoints = 0  // 容器元素个数
    let containerElements = this.whiteBoxElements  // 定义外层容器元素集合

    // 选中dom的名称
    const getSelector = (element: Element) => {
      if (element.id) {
        return `#${element.id}`
      } else if (element.className) {
        return `.${element.className.split(' ').join('.')}`
      }
      return element.tagName.toLowerCase()
    }

    // 是否为容器节点
    const isContainer = (element: Element | null) => {
      if (!element) {
        emptyPoints++
        return
      }
      let selector = getSelector(element)
      if (containerElements.indexOf(selector) !== -1) {
        emptyPoints++
      }
    }

    for (let i = 1; i <= 9; i++) {
      let xPoint = document.elementFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)
      let yPoint = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)
      isContainer(xPoint)
      if (i !== 5) {
        isContainer(yPoint)
      }
    }

    if (emptyPoints == 17) {
      this.transport.send({
        event_type: 'whiteScreen',
        path: window.location.pathname,
      })
    }
  }
  // 轮训修正
}
