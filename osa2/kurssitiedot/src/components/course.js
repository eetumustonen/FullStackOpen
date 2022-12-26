const Header = ({ name }) => <h1>{name}</h1>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </>
  )
}

const Part = ({ part }) => {
  return (
      <p>
        {part.name} {part.exercises}
      </p>
  )
}

const Total = ({ parts }) => {
  return (
      <p>
        Number of exercises {
          parts.reduce((sum, part) => sum + part.exercises, 0)
        }
      </p>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course