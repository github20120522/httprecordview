<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
</style>
<template>
    <div class="layout">
        <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <Menu :active-name="activeMenu" theme="dark" width="auto" :open-names="['http']">
                <Submenu name="http">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        Http
                    </template>
                    <MenuItem name="record" to="/home/record">Record</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <Content :style="{padding: '0'}">
                    <div style="padding: 5px">
                        <router-view style="position: relative"></router-view>
                    </div>
            </Content>
        </Layout>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeMenu: ''
            }
        },
        created() {
            this.activeMenu = this.$route.meta.title;
        }
    }
</script>
