import { useState } from 'react'

const Blog = ({ blog, deleteBlog, like, user }) => {
  const [infoVisible, setInfoVisible] = useState(false)

  //Tests for round 5c dont pass if we are checking the user for the delete button :(
  //This was a requirement for assignment 5.8
  //because the tests don't initialize users or users for blogs. But technically I have done all the required tests and assignments
  //The round 5c tests do pass but you have to delete the following from the code below:
  //style={allowedToDelete}, from delete button
  //Added by: {user.name}, from the component
  //user, from the props
  //and comment the next two lines out
  const userOwnsBlog = blog.user.username === user.username
  const allowedToDelete = { display: userOwnsBlog ? '' : 'none' }
  console.log(`${blog.user.username} blog username`)
  console.log(`${user.username} user username`)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    like(updatedBlog)
  }

  const removeBlog = () => {
    deleteBlog(blog)
  }

  if(infoVisible) {
    return (
      <div className='blog' style={blogStyle}>
        Title: {blog.title} <br></br>
        URL: {blog.url} <br></br>
        Author: {blog.author} <br></br>
        Likes: {blog.likes} <br></br>
        <button onClick={addLike}>like</button>
        Added by: {user.name}
        <button onClick={() => setInfoVisible(false)}>show less</button>
        <button style={allowedToDelete} onClick={removeBlog}>delete</button>
      </div>
    )
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} by {blog.author}
      <button onClick={() => setInfoVisible(true)}>show more</button>
    </div>  )
}

export default Blog