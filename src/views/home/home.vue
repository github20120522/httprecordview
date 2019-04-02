<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .layout-header-bar {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .layout-logo-left {
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }

    .menu-icon {
        transition: all .3s;
    }

    .rotate-icon {
        transform: rotate(-90deg);
    }

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Sider ref="sider" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu :active-name="activeMenu" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="test" to="/home/test">
                        <Icon type="md-bookmarks"/>
                        <span>Test</span>
                    </MenuItem>
                    <MenuItem name="test2" to="/home/test2">
                        <Icon type="md-bookmarks"/>
                        <span>Test 2</span>
                    </MenuItem>
                    <MenuItem name="test3" to="/home/test3">
                        <Icon type="md-bookmarks"/>
                        <span>Test 3</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu"
                          size="24"></Icon>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '840px'}">
                    <router-view style="position: relative"></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                isCollapsed: false,
                activeMenu: ''
            }
        },
        computed: {
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            collapsedSider() {
                console.log(1);
                this.$refs.sider.toggleCollapse();
                console.log(2);
            }
        },
        created() {
            let routeTitle = this.$route.meta.title;
            if (routeTitle === 'home') {
                this.$router.push("/home/welcome");
            } else {
                this.activeMenu = routeTitle;
            }
        }
    }
</script>
