export const site = {
  name: "王子明的数字工作室",
  title: "王子明的数字工作室 | 项目、文章、随记",
  description:
    "一个记录 Web 产品开发、技术写作、个人知识管理和作品集的中文个人博客。",
  url: "https://wzm-blog.vercel.app",
  author: "王子明",
} as const;

export const navItems = [
  { href: "/", label: "首页" },
  { href: "/writing/", label: "技术" },
  { href: "/notes/", label: "随笔" },
  { href: "/daily/", label: "日常" },
  { href: "/projects/", label: "项目" },
  { href: "/about/", label: "关于" },
] as const;
