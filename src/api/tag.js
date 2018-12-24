import request from '@/utils/request'

export function getTag() {
  return request({
    url: '/tag',
    method: 'get'
  })
}

export function putTag(id) {
  return request({
    url: '/tag',
    method: 'put',
    params: { id }
  })
}

export function postTag(query) {
  return request({
    url: '/tag',
    method: 'post',
    params: query
  })
}

export function deleteTag(id) {
  return request({
    url: '/tag',
    method: 'delete',
    params: { id }
  })
}
