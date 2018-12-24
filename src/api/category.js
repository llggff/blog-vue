import request from '@/utils/request'

export function getCategory() {
  return request({
    url: '/category',
    method: 'get'
  })
}

export function putCategory(id) {
  return request({
    url: '/category',
    method: 'put',
    params: { id }
  })
}

export function postCategory(query) {
  return request({
    url: '/category',
    method: 'post',
    params: query
  })
}

export function deleteCategory(id) {
  return request({
    url: '/category',
    method: 'delete',
    params: { id }
  })
}
