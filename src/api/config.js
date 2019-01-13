import request from '@/utils/request'

export function getConfig(type) {
  return request({
    url: '/config',
    method: 'get',
    params: { type }
  })
}

export function putConfig(id) {
  return request({
    url: '/config',
    method: 'put',
    params: { id }
  })
}

export function postConfig(data) {
  return request({
    url: '/config',
    method: 'post',
    data
  })
}

export function deleteConfig(id, status, isDelete) {
  return request({
    url: '/config',
    method: 'delete',
    params: { id, status, isDelete }
  })
}
