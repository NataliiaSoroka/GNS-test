import api from '@/services/api'

export default {
  fetchTable () {
    return api().get('table')
  },
  addNewItem (params) {
    return api().post('table', params)
  },
  updateItem (params) {
    return api().put(`table/${params._id}`, params)
  },
  deleteItem (id) {
    return api().delete(`table/${id}`)
  }
}
