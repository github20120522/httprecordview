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
            path: 'record',
            meta: {
                title: 'record'
            },
            component: (resolve) => require(['./views/home/record.vue'], resolve)
        }]
    }
];
export default routers;
