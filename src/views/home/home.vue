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
                    <MenuItem name="record">Record</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
        <Layout :style="{marginLeft: '200px'}">
            <Content :style="{padding: '0 16px 16px'}">
                <Breadcrumb :style="{margin: '16px 0'}">
                    <BreadcrumbItem>home</BreadcrumbItem>
                    <BreadcrumbItem>{{activeMenu}}</BreadcrumbItem>
                </Breadcrumb>
                <Card>
                    <div style="height: 800px">
                        <router-view style="position: relative"></router-view>
                    </div>
                </Card>
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
            let routeTitle = this.$route.meta.title;
            if (routeTitle === 'home') {
                this.$router.push("/home/record");
            } else {
                this.activeMenu = routeTitle;
            }
        }
    }
</script>
