
const Person = ( {person, deletePerson} ) => {
    return (
      <>
        <p>{person.name} {person.number}</p>
        <button onClick={() => deletePerson(person.id)}>delete</button>
      </>
    )
  }
  
  const People = ( {people, deletePerson} ) => {
    return (
      people.map(person => <Person 
                            key={person.name}
                            person={person}
                            deletePerson={deletePerson}
                            />)
    )
  }
  
  const PersonForm = ( {newName, newNumber, addPerson, handleNameChange, handleNumberChange} ) => {
    return (
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }
  
  const Filter = ( { filter, handleFilterChange } ) => {
    return (
      <div>
        <form>
          search: <input value={filter} onChange={handleFilterChange} />
        </form>
      </div>
      
    )
  }

  export { Filter, People, PersonForm }