export const site = {
  name: "小志的博客",
  title: "小志的博客 | 技术文章、随笔和日常",
  description:
    "小志记录 Web 产品开发、技术写作、生活点滴和作品集的中文个人博客。",
  url: "https://wzm-blog.vercel.app",
  author: "小志",
} as const;

export const navItems = [
  { href: "/", label: "首页" },
  { href: "/writing/", label: "技术" },
  { href: "/notes/", label: "随笔" },
  { href: "/daily/", label: "日常" },
  { href: "/projects/", label: "项目" },
  { href: "/about/", label: "关于" },
] as const;
