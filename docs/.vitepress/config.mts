import { defineConfig } from 'vitepress'

// ─────────────────────────────────────────────────────────────────────────────
// 站点常量（与旧站 build.py 保持同源）
// ─────────────────────────────────────────────────────────────────────────────
const SITE_NAME = 'BMAHS'
const PROTOCOL_VERSION = 'bmahs/1.2'
const ORIGIN = 'https://www.bmahs.com'
const REPO = 'https://github.com/XJPeng12/bmahs-site'

const HOME_DESC = {
  zh: 'BMAHS（大模型智能体硬件规范 bmahs/1.2）—— 智能体与硬件设备之间的普通话。TCP 上的 JSON-RPC 2.0 控制通道，为 AGI 就绪，支持一句话现场编排。',
  en: 'BMAHS (Big Model Agent Hardware Specification, bmahs/1.2) — a common language between agents and hardware. JSON-RPC 2.0 over TCP, Ready for AGI, one-sentence orchestration.',
}

// ─────────────────────────────────────────────────────────────────────────────
// 导航数据（slug, 中文标签, 英文标签）—— 与旧站 build.py NAV 一致
// ─────────────────────────────────────────────────────────────────────────────
const SPEC_NAV = [
  ['spec-index', '规范总览', 'Specification Overview'],
  ['spec-scope', '01 范围', '01 Scope'],
  ['spec-refs', '02 规范性引用', '02 Normative References'],
  ['spec-terms', '03 术语与约定', '03 Terms & Conventions'],
  ['spec-keywords', '04 需求关键词', '04 Requirement Keywords'],
  ['spec-arch', '05 协议总体架构', '05 Protocol Architecture'],
  ['spec-transport', '06 传输层规范', '06 Transport Layer'],
  ['spec-udp', '07 公共编码规则', '07 Discovery Encoding'],
  ['spec-jsonrpc', '08 消息编码规范', '08 Control Messaging: JSON-RPC 2.0'],
  ['spec-errors', '09 错误码规范', '09 Error Codes'],
  ['spec-desc', '10 设备描述与自述', '10 Device Description & Self-Description'],
  ['spec-occ', '11 占用策略与状态机', '11 Occupancy & State Machine'],
  ['spec-agent', '12 智能体与协议客户端义务', '12 Agent & Client Obligations'],
  ['spec-ui', '13 UI接口', '13 UI Interface'],
  ['spec-endpoint', '14 端点与数据流接口', '14 Endpoint & Data Stream Interface'],
  ['spec-msg', '15 发现报文定义', '15 Discovery Messages'],
  ['spec-flow', '16 连接后使用流程', '16 Post-Connect Usage Flow'],
  ['spec-bonjour', '17 Bonjour TXT 记录', '17 Bonjour / DNS-SD TXT Records'],
  ['spec-conform', '18 一致性要求与实现清单', '18 Conformance Checklist'],
  ['spec-compat', '19 互操作规范', '19 Interoperability'],
  ['spec-sec', '20 安全性考虑', '20 Security Considerations'],
  ['spec-appendix', '附录 A · 索引', 'Appendix A. Index'],
]

const NAV = [
  ['开始', 'Getting Started', [
    ['intro', 'BMAHS 是什么', 'What is BMAHS'],
    ['quickstart', '快速开始', 'Quickstart'],
  ]],
  ['核心概念', 'Core Concepts', [
    ['architecture', '架构与生态位', 'Architecture & Ecosystem'],
    ['orchestration', '自然语言编排 ★', 'Natural-Language Orchestration ★'],
    ['self-description', '设备自述', 'Device Self-Description'],
    ['operations', '能力清单与安全边界', 'Capabilities & Security'],
    ['occupancy', '占用与租约', 'Occupancy & Leases'],
    ['discovery', '设备发现', 'Device Discovery'],
    ['streaming', '数据流：推与拉', 'Data Streams: Push & Pull'],
  ]],
  ['规范全文', 'Specification', SPEC_NAV],
  ['规范参考', 'Reference', [
    ['tools', '方法与报文参考', 'Methods & Messages'],
    ['fields', '字段与消息', 'Fields & Messages'],
  ]],
  ['生态', 'Ecosystem', [
    ['ready', 'AGI-Ready 认证', 'AGI-Ready Certification'],
    ['about', '关于与许可', 'About & License'],
  ]],
]

const link = (slug, lang) => (lang === 'zh' ? `/docs/${slug}.html` : `/en/docs/${slug}.html`)

const sidebarFor = (lang) =>
  NAV.map(([zhGroup, enGroup, items]) => ({
    text: lang === 'zh' ? zhGroup : enGroup,
    items: items.map(([slug, zhLabel, enLabel]) => ({
      text: lang === 'zh' ? zhLabel : enLabel,
      link: link(slug, lang),
    })),
  }))

const navFor = (lang) => {
  const p = (slug) => link(slug, lang)
  return [
    {
      text: lang === 'zh' ? '文档' : 'Docs',
      link: p('intro'),
      activeMatch: '^/(en/)?docs/(intro|quickstart|architecture|orchestration|self-description|operations|occupancy|discovery|streaming)',
    },
    {
      text: lang === 'zh' ? '规范' : 'Spec',
      link: p('spec-index'),
      activeMatch: '^/(en/)?docs/(spec-|tools|fields)',
    },
    {
      text: lang === 'zh' ? '生态' : 'Ecosystem',
      link: p('ready'),
      activeMatch: '^/(en/)?docs/(ready|about)',
    },
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// 各语言 themeConfig
// ─────────────────────────────────────────────────────────────────────────────
const themeFor = (lang) => {
  const zh = lang === 'zh'
  return {
    nav: navFor(lang),
    sidebar: sidebarFor(lang),
    outline: { level: [2, 3], label: zh ? '本页内容' : 'On this page' },
    docFooter: { prev: zh ? '← 上一篇' : '← Previous', next: zh ? '下一篇 →' : 'Next →' },
    search: {
      provider: 'local',
      options: {
        translations: zh
          ? {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            }
          : undefined,
      },
    },
    editLink: {
      pattern: `${REPO}/edit/main/docs/:path`,
      text: zh ? '在 GitHub 上编辑此页' : 'Edit this page on GitHub',
    },
    socialLinks: [{ icon: 'github', link: REPO }],
    footer: zh
      ? {
          message: '本站内容依 <a href="/docs/about.html">CC BY 4.0</a> 授权；示例代码 CC0。',
          copyright: `BMAHS · ${PROTOCOL_VERSION} — 让硬件说“普通话”，为 AGI 就绪`,
        }
      : {
          message: 'Site content licensed under <a href="/en/docs/about.html">CC BY 4.0</a>; sample code CC0.',
          copyright: `BMAHS · ${PROTOCOL_VERSION} — give hardware a common language, make it Ready for AGI`,
        },
    darkModeSwitchLabel: zh ? '主题' : 'Theme',
    lightModeSwitchTitle: zh ? '切换到浅色模式' : 'Switch to light theme',
    darkModeSwitchTitle: zh ? '切换到深色模式' : 'Switch to dark theme',
    sidebarMenuLabel: zh ? '菜单' : 'Menu',
    returnToTopLabel: zh ? '回到顶部' : 'Back to top',
    externalLinkIcon: true,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 主配置
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  lang: 'zh-CN',
  title: SITE_NAME,
  titleTemplate: ':title · BMAHS',
  description: HOME_DESC.zh,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'icon', sizes: 'any', href: '/favicon.ico' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, noai, noimageai, noarchive' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],
  sitemap: { hostname: ORIGIN },
  cleanUrls: false, // GitHub Pages 静态托管保留 .html 后缀最稳妥
  ignoreDeadLinks: false,
  lastUpdated: false,

  locales: {
    root: { label: '简体中文', lang: 'zh-CN', themeConfig: themeFor('zh') },
    en: { label: 'English', lang: 'en', themeConfig: themeFor('en') },
  },

  transformHead({ pageData }) {
    // 每页 canonical / Open Graph / Twitter 卡片
    const route =
      '/' + (pageData.relativePath ?? '').replace(/\.md$/, '.html').replace(/(^|\/)index\.html$/, '')
    const url = ORIGIN + (route === '/.' ? '/' : route)
    const isEn = url.startsWith(`${ORIGIN}/en`)
    const desc = pageData.description ?? pageData.title ?? ''
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: pageData.title ?? SITE_NAME }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:locale', content: isEn ? 'en_US' : 'zh_CN' }],
      ['meta', { property: 'og:locale:alternate', content: isEn ? 'zh_CN' : 'en_US' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: pageData.title ?? SITE_NAME }],
      ['meta', { name: 'twitter:description', content: desc }],
    ]
  },
})
