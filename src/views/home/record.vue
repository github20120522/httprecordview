<template>
    <div>
        <div style="margin-bottom: 3px">
            <Input placeholder="录制请求的域名，空格分割，* 代表所有，空代表不录制"
                   :disabled="hostAble" size="large" v-model="recordSetting.host"/>
        </div>
        <Button size="large" :type="proxyStatus" shape="circle" :disabled="!recordSetting.proxyToggleAble" long
                style="margin-bottom: 3px;" @click="proxyToggle">
            {{proxyStatusDesc}}
        </Button>
        <div style="margin-bottom: 3px">
            <Row>
                <Col span="12">
                    <Input placeholder="HOST字符串匹配"
                           style="margin-right: 1px;"
                           size="large" :disabled="!recordSetting.proxyRunning"
                           v-model="recordSetting.hostFilter"/>
                </Col>
                <Col span="12">
                    <Input placeholder="URL字符匹配"
                           style="margin-left: 1px;"
                           size="large" :disabled="!recordSetting.proxyRunning"
                           v-model="recordSetting.urlFilter"/>
                </Col>
            </Row>
        </div>
        <Row>
            <Col span="12">
                <Button size="large" type="info" shape="circle" :disabled="!recordSetting.proxyRunning"
                        long style="margin-bottom: 3px; margin-left: 1px;" @click="scrollClear">
                    清空
                </Button>
            </Col>
            <Col span="12">
                <Button size="large" :type="scrollStatus" shape="circle" :disabled="!recordSetting.proxyRunning"
                        long style="margin-bottom: 3px; margin-right: 1px;" @click="scrollToggle">
                    {{scrollStatusDesc}}
                </Button>
            </Col>
        </Row>
        <Table border ref="table" :columns="columns" :data="data" height="260"></Table>
        <Row ref="card" style="background: #eee; padding-top: 3px;">
            <Col span="12">
                <Card :style="{height: cardHeight, 'overflow-y': 'scroll', 'overflow-wrap': 'break-word'}">
                    <p slot="title" style="color: green">
                        请求明细
                    </p>
                    <p v-for="request in recordData.request">
                        {{ request }}
                    </p>
                </Card>
            </Col>
            <Col span="12">
                <Card :style="{height: cardHeight, 'overflow-y': 'scroll', 'overflow-wrap': 'break-word'}">
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
        mounted() {
            this.cardHeight = (window.innerHeight - this.$refs.card.$el.offsetTop - 15) + 'px';
        },
        watch: {
            data() {
                setTimeout(function () {
                    let tableEl = document.querySelector('.ivu-table-body');
                    tableEl.scrollTop = tableEl.scrollHeight;
                }, 1);
            }
        },
        computed: {
            hostAble: function () {
                return this.recordSetting.proxyRunning;
            },
            proxyStatus: function () {
                return this.recordSetting.proxyRunning ? 'error' : 'primary';
            },
            proxyStatusDesc: function () {
                return this.recordSetting.proxyRunning ? '停止代理（代理已启动，端口号：23333）' : '启动代理';
            },
            scrollStatus: function () {
                return this.recordSetting.scrollAble ? 'success' : 'info';
            },
            scrollStatusDesc: function () {
                return this.recordSetting.scrollAble ? '停止滚动' : '启动滚动';
            }
        },
        data() {
            return {
                cardHeight: '0px',
                recordSetting: {
                    host: '',
                    urlFilter: '',
                    hostFilter: '',
                    loopTimer: null,
                    lastRecordId: '0',
                    scrollAble: true,
                    proxyRunning: false,
                    proxyToggleAble: true
                },
                recordData: {
                    request: [],
                    response: []
                },
                columns: [
                    {
                        title: '域名',
                        key: 'host',
                        width: 260
                    },
                    {
                        title: '方法',
                        key: 'method',
                        width: 150
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
                                            this.recordDetail(params.row.id);
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
            proxyToggle() {
                this.recordSetting.proxyToggleAble && this.recordSetting.proxyRunning ? this.proxyStop() : this.proxyStart();
            },
            proxyStart() {
                let me = this;
                this.recordSetting.proxyToggleAble = false;
                this.$apis.proxyStart({
                    host: me.recordSetting.host
                }, function (result) {
                    me.recordSetting.proxyToggleAble = true;
                    if (result.data.success) {
                        me.recordSetting.proxyRunning = true;
                        me.scrollStart();
                    } else {
                        me.$Modal.info({title: '提示', content: result.data.message});
                    }
                }, function (err) {
                    me.recordSetting.proxyToggleAble = true;
                    me.recordSetting.proxyRunning = false;
                    me.scrollStop();
                    me.recordSetting.lastRecordId = '0';
                    me.$Modal.info({title: '提示', content: "代理服务没响应"});
                });
            },
            proxyStop() {
                let me = this;
                this.recordSetting.proxyToggleAble = false;
                this.$apis.proxyStop(function (result) {
                    me.recordSetting.proxyToggleAble = true;
                    if (result.data.success) {
                        me.recordSetting.proxyRunning = false;
                        me.scrollStop();
                        me.recordSetting.lastRecordId = '0';
                    } else {
                        me.$Modal.info({title: '提示', content: result.data.message});
                    }
                }, function (err) {
                    me.recordSetting.proxyToggleAble = true;
                    me.recordSetting.proxyRunning = false;
                    me.scrollStop();
                    me.recordSetting.lastRecordId = '0';
                    me.$Modal.info({title: '提示', content: "代理服务没响应"});
                });
            },
            scrollToggle() {
                this.recordSetting.scrollAble ? this.scrollStop() : this.scrollStart();
            },
            scrollClear() {
                this.data = [];
            },
            scrollStart() {
                let me = this;
                this.scrollStop();
                me.recordSetting.scrollAble = true;
                me.recordQuery();
            },
            scrollStop() {
                this.recordSetting.scrollAble = false;
                this.recordQueryStop();
            },
            recordQuery() {
                let me = this;
                me.recordSetting.loopTimer = setTimeout(function () {
                    me.$apis.recordQuery({
                        lastRecordId: me.recordSetting.lastRecordId
                    }, function (result) {
                        if (result.data.success) {
                            let records = result.data.data;
                            if (records && records.length > 0) {
                                for (let i = 0; i < records.length; i++) {
                                    let hostFlag = false;
                                    let urlFlag = false;
                                    if (me.recordSetting.hostFilter) {
                                        if (records[i].host.indexOf(me.recordSetting.hostFilter) > -1) {
                                            hostFlag = true;
                                        }
                                    } else {
                                        hostFlag = true;
                                    }
                                    if (me.recordSetting.urlFilter) {
                                        if (records[i].url.indexOf(me.recordSetting.urlFilter) > -1) {
                                            urlFlag = true;
                                        }
                                    } else {
                                        urlFlag = true;
                                    }
                                    if (hostFlag && urlFlag) {
                                        me.data.push(records[i]);
                                    }
                                }
                                if (me.data.length > 100) {
                                    me.data.splice(0, 50);
                                }
                                me.recordSetting.lastRecordId = records[records.length - 1].id;
                            }
                        } else {
                            me.$Modal.info({title: '提示', content: result.data.message});
                        }
                        me.recordQuery();
                    }, function (err) {
                        me.proxyStop();
                    });
                }, 1000);
            },
            recordQueryStop() {
                if (this.recordSetting.loopTimer) {
                    clearTimeout(this.recordSetting.loopTimer);
                    this.recordSetting.loopTimer = null;
                }
            },
            recordDetail(id) {
                let me = this;
                me.recordData.request = [];
                me.recordData.response = [];
                this.$apis.recordDetail({
                    recordId: id
                }, function (result) {
                    if (result.data.success) {
                        me.recordData.request = result.data.data.request;
                        me.recordData.response = result.data.data.response;
                    } else {
                        me.$Modal.info({title: '提示', content: result.data.message});
                    }
                }, function (err) {
                    me.proxyStop();
                });
            }
        }
    }
</script>
