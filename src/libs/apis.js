import Env from '../config/env';
import http from 'axios';

let isMock = Env === 'development';
let basePath = isMock ? "http://localhost/" : "/";
let apis = {
    proxyStart(callback) {
        http.get(basePath + "test").then(callback);
    }
};

export default apis;
