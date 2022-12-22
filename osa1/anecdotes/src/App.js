import { useState } from 'react'

const Button = (props) => {
  return (
  <button onClick={props.handleClick}>{props.value}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(7).fill(0))

  const handleNextClick = () => {
    const randomInt = Math.floor(Math.random() * anecdotes.length)
    console.log(randomInt)
    setSelected(randomInt)
  }

  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    console.log(votes)
  }

  const mostVotesAnecdoteIndex = () => {
    const maxVotes = Math.max(...votes)
    return votes.indexOf(maxVotes)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <Button handleClick={handleNextClick} value="Get another anecdote" />
      <p>
        {anecdotes[selected]}
      </p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={handleVoteClick} value="Vote!" />
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[mostVotesAnecdoteIndex()]}</p>
      <p>has {votes[mostVotesAnecdoteIndex()]} votes</p>
    </div>
  )
}



export default App