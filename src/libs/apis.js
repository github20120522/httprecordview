import Env from '../config/env';
import http from 'axios';

let isMock = Env === 'development';
let basePath = isMock ? "http://localhost" : "";
http.defaults.baseURL = basePath;
http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
http.defaults.timeout = 10000;

let apis = {
    proxyStart(params, callback, errCallback) {
        http.post("/api/record/proxyStart", params)
            .then(callback)
            .catch(errCallback);
    },
    proxyStop(callback, errCallback) {
        http.get("/api/record/proxyStop")
            .then(callback)
            .catch(errCallback);
    },
    recordQuery(params, callback, errCallback) {
        http.post("/api/record/recordQuery", params)
            .then(callback)
            .catch(errCallback);
    },
    recordDetail(params, callback, errCallback) {
        http.post("/api/record/recordDetail", params)
            .then(callback)
            .catch(errCallback);
    }
};

export default apis;
