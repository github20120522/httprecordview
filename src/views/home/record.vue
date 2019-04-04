<template>
    <div>
        <div style="margin-bottom: 3px">
            <Input placeholder="录制请求的域名，空格分割，* 代表所有，空代表不录制"
                   :disabled="hostDisabled" v-model="recordSetting.host"/>
        </div>
        <Button size="large" :type="proxyStatus" long style="margin-bottom: 3px;" @click="proxyToggle">
            {{proxyStatusDesc}}
        </Button>
        <div style="margin-bottom: 3px">
            <Input placeholder="URL字符匹配" v-model="recordSetting.filter"/>
        </div>
        <Table border ref="selection" :columns="columns" :data="data" height="300"></Table>
        <Row style="background: #eee; padding: 10px; height: 430px;">
            <Col span="12">
                <Card style="height: 400px; overflow-y: scroll;">
                    <p slot="title" style="color: green">
                        请求明细
                    </p>
                    <p v-for="request in recordData.request">
                        {{ request }}
                    </p>
                </Card>
            </Col>
            <Col span="12">
                <Card style="height: 400px; overflow-y: scroll;">
                    <p slot="title" style="color: blue">
                        响应明细
                    </p>
                    <p v-for="response in recordData.response">
                        {{ response }}
                    </p>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        watch: {
            data() {
                setTimeout(function () {
                    document.querySelector('.ivu-table-body').scrollTop = document.querySelector('.ivu-table-body').scrollHeight;
                }, 20);
            }
        },
        computed: {
            hostDisabled: function () {
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
                    proxyRunning: false,
                    loopTimer: null,
                    lastRecordId: 0
                },
                recordData: {
                    request: [],
                    response: []
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
                this.recordDetail(params.row.id);
            },
            proxyToggle() {
                this.recordSetting.proxyRunning ? this.proxyStop() : this.proxyStart();
            },
            proxyStart() {
                let me = this;
                this.$apis.proxyStart({
                    host: me.recordSetting.host
                }, function (result) {
                    if (result.data.success) {
                        me.recordSetting.proxyRunning = true;
                        if (me.recordSetting.loopTimer) {
                            clearInterval(me.recordSetting.loopTimer);
                        }
                        me.recordSetting.loopTimer = setInterval(function () {
                            me.recordQuery();
                        }, 1000);
                    } else {
                        this.$Modal.info(result.data.message);
                    }
                });
            },
            proxyStop() {
                let me = this;
                this.$apis.proxyStop(function (result) {
                    if (result.data.success) {
                        me.recordSetting.proxyRunning = false;
                        if (me.recordSetting.loopTimer) {
                            clearInterval(me.recordSetting.loopTimer);
                            me.recordSetting.loopTimer = null;
                            me.recordSetting.lastRecordId = 0;
                        }
                    } else {
                        this.$Modal.info(result.data.message);
                    }
                });
            },
            recordQuery() {
                let me = this;
                this.$apis.recordQuery({
                    filter: me.recordSetting.filter,
                    lastRecordId: me.recordSetting.lastRecordId
                }, function (result) {
                    if (result.data.success) {
                        let records = result.data.data.records;
                        if (records && records.length > 0) {
                            for (let i = 0; i < records.length; i++) {
                                me.data.push(records[i]);
                            }
                            me.recordSetting.lastRecordId = records[records.length - 1].id;
                        }
                    } else {
                        this.$Modal.info(result.data().message);
                    }
                });
            },
            recordDetail(id) {
                let me = this;
                this.$apis.recordDetail({
                    recordId: id
                }, function (result) {
                    if (result.data.success) {
                        me.recordData.request = result.data.data.request;
                        me.recordData.response = result.data.data.response;
                    } else {
                        this.$Modal.info(result.data().message);
                    }
                });
            }
        }
    }
</script>
