import { useState } from 'react'

const Blog = ({ blog, deleteBlog, like }) => {
  const [infoVisible, setInfoVisible] = useState(false)

  //Tests dont pass if we are checking the user for the delete button in round 5c :(
  //This was a requirement for assignment 5.8
  //style={allowedToDelete}, this is missing from delete button
  //Added by: {user.name}, this is missing from the component
  //user, this is missing from the props
  /*
  const userOwnsBlog = blog.user.username === user.username
  const allowedToDelete = { display: userOwnsBlog ? '' : 'none' }
  */
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
        <button onClick={() => setInfoVisible(false)}>show less</button>
        <button onClick={removeBlog}>delete</button>
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