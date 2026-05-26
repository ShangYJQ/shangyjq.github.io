import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "ShangYJQ's Blog",
	description: "ShangYJQ 的个人博客",
	lang: 'zh-CN',
	appearance: "dark",
	markdown: {
		theme: {
			light: "catppuccin-latte",
			dark: "catppuccin-mocha",
		},
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: '首页', link: '/' },
			{ text: 'C++ 系列', link: '/posts/cpp-async' }
		],

		sidebar: [
			{
				text: 'C++ 系列',
				items: [
					{ text: 'C++ 异步编程入门', link: '/posts/cpp-async' }
				]
			}
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }
		],

		docFooter: {
			prev: '上一篇',
			next: '下一篇'
		},

		outline: {
			level: [2, 3],
			label: '本页目录'
		},

	}
})

