export interface KunNavItem {
  name: string
  href: string
}

export const kunNavItem: KunNavItem[] = [
  {
    name: '游戏下载',
    href: '/galgame'
  },
  {
    name: '游戏标签',
    href: '/tag'
  },
  {
    name: '帮助文档',
    href: '/doc'
  },
  {
    name: '友情链接',
    href: '/friend-link'
  }
]

export const kunMobileNavItem: KunNavItem[] = [
  ...kunNavItem,
  {
    name: '补丁评论列表',
    href: '/comment'
  },
  {
    name: '补丁资源列表',
    href: '/resource'
  },
  {
    name: '联系我们',
    href: '/doc/notice/feedback'
  }
]
