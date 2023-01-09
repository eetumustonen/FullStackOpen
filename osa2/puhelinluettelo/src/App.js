import { useState, useEffect } from 'react'
import personService from './services/persons'
import { People, Filter, PersonForm } from './components/peopleComps'
import { Notification, ErrorNotification } from './components/notifications'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const hasName = persons.map(person => person.name).includes(newName)
    const hasNumber = persons.map(person => person.number).includes(newNumber)
    
    if(hasName && hasNumber){
      setNewName('')
      setNewNumber('')
      return alert(`${newName} is already added to phonebook`)
    } else if(hasNumber){
      setNewName('')
      setNewNumber('')
      return alert(`Number ${newNumber} is already on the phonebook`)
    } else if(hasName){
      const confirmation = window.confirm(`${newName} is already added to phonebook with a different number.\nWould you like to replace the old number?`)
      if(confirmation){
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
        personService
          .updateNumber(changedPerson)
          .then(returnedPerson => {
            setMessage(`Updated ${person.name}'s number`)
              setTimeout(() => {
              setMessage(null)
              }, 3000)
            setPersons(persons.map(p => p !== person ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log("Error message: ", error.response.data.error)
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setMessage(`Added ${personObject.name}`)
            setTimeout(() => {
            setMessage(null)
            }, 3000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log("Error message: ", error.response.data.error)
          setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
        })
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    const confirmation = window.confirm(
      `Are you sure you want to delete the number: 
      ${person.name} ${person.number}`
      )
    if(confirmation){
    console.log(`delete id: ${id}`)
    personService
      .deletePerson(id)
      .then(returnedPerson => {
        setMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        console.log(error)
        setErrorMessage(`${person.name} has already been deleted`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const filterPeople = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())) 

  return (
    <div>
      <h1>My Phonebook</h1>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange}
      />
      <h3>Add a new number</h3>
      <PersonForm 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        />
      <h2>Numbers</h2>
      <People people={filterPeople} deletePerson={deletePerson}/>
    </div>
  )

}

export default App