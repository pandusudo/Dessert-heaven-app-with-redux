import axios from 'axios'

export const categories = () => {
  return {
    type: 'GET_CATEGORIES',
    payload: axios.get('http://localhost:3333/api/categories',{
      headers: {
        Authorization: localStorage.getItem('keyToken')
      }
    })
  }
}
