import request from '@/utils/request'

export function getArticle(query) {
  return request({
    url: '/article',
    method: 'get',
    params: query
  })
}

export function putArticle(id) {
  return request({
    url: '/article',
    method: 'put',
    params: { id }
  })
}

export function postArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
