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

export function deleteArticle(id, status, isDelete) {
  return request({
    url: '/article',
    method: 'delete',
    params: { id, status, isDelete }
  })
}
