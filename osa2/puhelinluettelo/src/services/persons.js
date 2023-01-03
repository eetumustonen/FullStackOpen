import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
  
const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deletePerson = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

//update person number with axios.put
const updateNumber = (changedPerson) => {
  const url = `${baseUrl}/${changedPerson.id}`
  const request = axios.put(url, changedPerson)
  return request.then(response => response.data)
}

const exportedObject = {
  getAll,
  create,
  deletePerson,
  updateNumber
};

export default exportedObject;