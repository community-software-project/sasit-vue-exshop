'use strict';

let baseURL = 'http://127.0.0.1:8080/oxygenfactory';
let timeoutShort = 10000;//ms
let timeoutLong = 60000;//ms
import Vue from 'vue';
import axios from 'axios';

axios.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error)
})

function checkStatus(response) {
  if (response && (response.status === 200 || response.status === 202 || response.status === 304 || response.status === 201 || response.status === 204 || response.status === 300)) {
    return response
  }
  return {
    status: response.status,
    rsStatus: typeof (response) != 'undefined' ? response.status : 404,
    msg: JSON.stringify(response),
    response: response
  }
}

function checkCode(res) {
  if (res.status === -404) {
  }
  if (res.data && (!res.data.success)) {
  }
  return res
}

export default {
  post(url, data, headers) {
    return axios({
      method: 'post',
      baseURL: baseURL,
      url,
      data: data,
      timeout: timeoutLong,
      headers,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  put(url, data, headers) {
    return axios({
      method: 'put',
      baseURL: baseURL,
      url,
      data: data,
      timeout: timeoutLong,
      headers,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  patch(url, data, headers) {
    return axios({
      method: 'patch',
      baseURL: baseURL,
      url,
      data: data,
      timeout: timeoutLong,
      headers,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  delete(url, data, headers) {
    return axios({
      method: 'delete',
      baseURL: baseURL,
      url,
      data: data,
      timeout: timeoutLong,
      headers,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params, headers) {
    return axios({
      method: 'get',
      baseURL: baseURL,
      url,
      params, // get 请求时带的参数
      timeout: timeoutLong,
      headers,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
