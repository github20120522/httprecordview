<template>
    <div>
        <div style="margin-bottom: 3px">
            <Input placeholder="录制域名，空格分割，*代表所有，空代表不拦截"
                   :disabled="hostEditable" v-model="recordSetting.host"/>
        </div>
        <Button size="large" :type="proxyStatus" long style="margin-bottom: 3px;" @click="proxyStart">
            {{proxyStatusDesc}}
        </Button>
        <div style="margin-bottom: 3px">
            <Input placeholder="URL字符匹配" v-model="recordSetting.filter"/>
        </div>
        <Table border ref="selection" :columns="columns" :data="data" height="300"></Table>
    </div>
</template>
<script>
    export default {
        computed: {
            hostEditable: function () {
                return this.recordSetting.proxyRunning;
            },
            proxyStatus: function () {
                return this.recordSetting.proxyRunning ? 'error' : 'primary';
            },
            proxyStatusDesc: function () {
                return this.recordSetting.proxyRunning ? '停止代理' : '启动代理';
            }
        },
        data() {
            return {
                recordSetting: {
                    host: '',
                    filter: '',
                    proxyRunning: false
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '方法',
                        key: 'method',
                        width: 80
                    },
                    {
                        title: '请求地址',
                        key: 'url'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.view(params)
                                        }
                                    }
                                }, '详细信息')
                            ]);
                        }
                    }
                ],
                data: []
            }
        },
        methods: {
            view(params) {
                console.log(params.row);
            },
            proxyStart() {
                let me = this;
                this.$apis.proxyStart(function (result) {
                    console.log(result);
                    me.recordSetting.proxyRunning = !me.recordSetting.proxyRunning;
                });
            }
        }
    }
</script>
