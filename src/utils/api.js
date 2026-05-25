import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // ← add /projects here
  timeout: 15000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api

export const projectsApi = {

  getAll: (params) =>
    api.get('/all', { params }),          // → GET /api/projects/all

  getSingle: (id) =>
    api.get(`/${id}`),                    // → GET /api/projects/:id

  create: (formData) =>
    api.post('/addProject', formData, {   // → POST /api/projects/addProject
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, formData) =>
    api.put(`/${id}`, formData, {         // → PUT /api/projects/:id
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id) =>
    api.delete(`/${id}`),                 // → DELETE /api/projects/:id
}