import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export const whatsapp = {
  getStatus: () => api.get('/whatsapp/status'),
  getQR: () => api.get('/whatsapp/qr'),
}

export const templates = {
  getAll: () => api.get('/templates'),
  create: (data) => api.post('/templates', data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  remove: (id) => api.delete(`/templates/${id}`),
}

export const lists = {
  getAll: () => api.get('/lists'),
  create: (data) => api.post('/lists', data),
  update: (id, data) => api.put(`/lists/${id}`, data),
  remove: (id) => api.delete(`/lists/${id}`),
}

export const campaigns = {
  getAll: () => api.get('/campaigns'),
  create: (data) => api.post('/campaigns', data),
  launch: (id) => api.post(`/campaigns/${id}/launch`),
  remove: (id) => api.delete(`/campaigns/${id}`),
}

export const history = {
  getAll: () => api.get('/history'),
}

export const send = {
  single: (data) => api.post('/send', data),
}

export default api
