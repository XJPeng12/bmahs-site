import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

/**
 * BMAHS 主题：默认主题 + 旧站样式移植。
 * enhanceApp 里委托监听 .code__copy 按钮，恢复旧站代码块「复制」交互
 * （VitePress 的复制按钮只对 shiki 代码块生效，这里覆盖旧式 .code 结构）。
 */
export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof document === 'undefined') return
    const root = document.documentElement as HTMLElement & { dataset: Record<string, string> }
    if (root.dataset.bmahsCopyWired === '1') return
    root.dataset.bmahsCopyWired = '1'

    document.addEventListener('click', (ev) => {
      const target = ev.target as Element | null
      const btn = target?.closest?.('.code__copy') as HTMLButtonElement | null
      if (!btn) return
      const pre = btn.closest('.code')?.querySelector('pre')
      if (!pre) return
      const text = pre.textContent ?? ''
      const oldLabel = btn.textContent
      const done = () => {
        btn.textContent = oldLabel === '复制' ? '已复制 ✓' : 'Copied ✓'
        window.setTimeout(() => {
          btn.textContent = oldLabel
        }, 1400)
      }
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done, done)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
        done()
      }
    })
  },
} satisfies Theme
