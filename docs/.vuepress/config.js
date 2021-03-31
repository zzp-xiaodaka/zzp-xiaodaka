module.exports = {
    title: 'Forest',
    description: 'Just playing around',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            {
                text: 'javascript',
                items: [
                    { text: 'js', link: '/web/js/' },
                    { text: 'vue', link: '/web/vue/' },
                    { text: 'react', link: '/web/react/' },
                    { text: 'webpack', link: '/web/webpack/' },
                    { text: 'babel', link: '/web/babel/' },
                ],
            },
            {
                text: 'node',
                items: [
                    { text: 'koa', link: '/node/koa/' },
                    { text: 'express', link: '/node/express/' },
                ],
            },
            {
                text: '数据库',
                items: [
                    { text: 'MongoDB', link: '/database/mongoDB/' },
                    { text: 'MySQL', link: '/database/mysql/' },
                ],
            },
            {
                text: 'go',
                items: [
                    { text: '基础', link: '/go/base/' },
                    { text: '项目', link: '/go/projects/' },
                ],
            },
            { text: '源码记录', link: '/interview/' },
        ],
        sidebar: {
            '/node/koa/': ['base', 'base1', 'base2'],
            '/web/js/': [
                {
                    title: 'javascript 学习',
                    collapsable: true,
                    children: ['语言的基础', 'test02', 'test03'],
                },
            ],
            '/web/webpack/': [
                {
                    title: 'javascript 学习',
                    collapsable: true,
                    children: ['模块化', 'test'],
                },
            ],
        },
        lastUpdated: '',
    },
    plugins: [
        '@vuepress/back-to-top',
        '@vuepress/active-header-links',
        '@vuepress/nprogress',
        '@vuepress/pwa',
        {
            serviceWorker: true,
            updatePopup: true,
        },
    ],
}
