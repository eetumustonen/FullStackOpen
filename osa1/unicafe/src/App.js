import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.value}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <td>
        {props.value}
      </td>
      <td>
        {props.count}
      </td>
    </>
  )
}

const Statistics = (props) => {
  if(props.sum === 0) {
    return (
      <p>No feedback yet</p>
    )
  } else {
    return (
      <table>
            <tbody>
              <tr><StatisticLine value="good" count={props.good}/></tr>
              <tr><StatisticLine value="neutral" count={props.neutral} /></tr>
              <tr><StatisticLine value="bad" count={props.bad} /></tr>
              <tr><StatisticLine value="all" count={props.sum} /></tr>
              <tr><StatisticLine value="average" count={props.average} /></tr>
              <tr><StatisticLine value="positive" count={props.positive +' %'} /></tr>
            </tbody>
          </table>
    )
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  const sum = good + neutral + bad
  const average = (good - bad)/sum*1.0
  const positive = good*100.0/sum

  
    return (
      <div>
      <h2>Give feedback</h2>
      <Button value="good" handleClick={handleGoodClick} />
      <Button value="neutral" handleClick={handleNeutralClick} />
      <Button value="bad" handleClick={handleBadClick} />
      <h2>Statistics</h2>
      <Statistics 
      good={good}
      neutral={neutral}
      bad={bad}
      sum={sum}
      average={average}
      positive={positive} />
    </div>
  )
}

export default App