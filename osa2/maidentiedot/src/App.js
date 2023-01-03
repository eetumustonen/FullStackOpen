import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ( { filter, handleFilterChange } ) => {
  return (
    <div>
      <form>
        search: <input value={filter} onChange={handleFilterChange} />
      </form>
    </div>
  )
}

const CountryInfo = ( {country} ) => {
  console.log("Country info: ", country)
  console.log('lang: ', country.languages)
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital: {country.capital}</p>
      <h4>languages</h4>
      <ul>
        {Object.entries(country.languages).map(
          lang => <li key={lang[0]}>{lang[1]}</li>
          )}
      </ul>
      <img src={country.flags.png} alt="country flag" />
    </div>
  )
}

const Country = ( { country } ) => {
  const [ show, setShow ] = useState(false)
  
  const handleCountryClick = () => {
    console.log('clicked')
    setShow(!show)
  }

  return (
    <li key={country.name.common}>
      {show ? 
        <CountryInfo country={country} />
      :
        <>
        {country.name.common}
        <button onClick={handleCountryClick}>show</button>
        </>
      }
    </li>
  )
}

const Countries = ( {countries} ) => {
  return (
    <div>
      <ul>
        {countries.length === 1 ?
          <CountryInfo 
              key={countries[0].name.common}
              country={countries[0]}
          />
        :
          <div>
            <h2>Countries</h2>
            {countries.map(country => <Country key={country.name.common}country={country}/>)}
          </div>
        }
      </ul>
    </div>
  )
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then(
      response => {
        console.log(response)
        setCountries(response.data)
      }
    )
  }, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const filteredCountries = countries.filter(
    country => country.name.common.toLowerCase()
    .includes(filter.toLowerCase()))

  const filterOk = filteredCountries.length <= 10

  return (
    <div>
      <h1>Country info</h1>
      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange}
      />
      {filterOk ?
      <Countries countries={filteredCountries} /> 
      : <p>Specify your search, please</p>}
    </div>
  )
}

export default App