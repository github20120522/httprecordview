const routers = [
    {
        path: '/',
        meta: {
            title: 'index'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/home',
        meta: {
            title: 'home'
        },
        component: (resolve) => require(['./views/home/home.vue'], resolve),
        children: [{
            path: 'welcome',
            meta: {
                title: 'welcome'
            },
            component: (resolve) => require(['./views/home/welcome.vue'], resolve)
        }, {
            path: 'test',
            meta: {
                title: 'test'
            },
            component: (resolve) => require(['./views/home/test.vue'], resolve)
        }, {
            path: 'test2',
            meta: {
                title: 'test2'
            },
            component: (resolve) => require(['./views/home/test2.vue'], resolve)
        }, {
            path: 'test3',
            meta: {
                title: 'test3'
            },
            component: (resolve) => require(['./views/home/test3.vue'], resolve)
        }]
    }
];
export default routers;
