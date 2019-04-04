import Env from '../config/env';
import http from 'axios';

let isMock = Env === 'development';
let basePath = isMock ? "http://localhost" : "";
http.defaults.baseURL = basePath;
http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

let apis = {
    proxyStart(params, callback) {
        http.post("/proxyStart", params).then(callback);
    },
    proxyStop(callback) {
        http.get("/proxyStop").then(callback);
    },
    recordQuery(params, callback) {
        http.post("/recordQuery", params).then(callback);
    },
    recordDetail(params, callback) {
        http.post("/recordDetail", params).then(callback);
    }
};

export default apis;
