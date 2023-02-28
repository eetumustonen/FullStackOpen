import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import { Notification, ErrorNotification } from './components/notifications'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`Logged in as ${user.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    setMessage('Logged out')
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      setMessage(`A new blog added: ${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch(exception) {
      setErrorMessage('something went wrong')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const deleteBlog = async (blog) => {
    const confirmation = window.confirm(`Delete blog: ${blog.title} by ${blog.author}`)
    if(confirmation){
      try {
        await blogService.deleteBlog(blog)
        setMessage('Blog deleted')
        setTimeout(() => {
          setMessage(null)
        }, 3000)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch(e) {
        setErrorMessage(e.message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      }
    }
  }

  const like = async (blog) => {
    await blogService.like(blog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : blog))
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message}/>
        <ErrorNotification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <p>logged in as {user.name}</p>
      <button onClick={() => handleLogout()}>log out</button>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
      <h2>blogs</h2>
      {blogs.sort((a, b) => (a.likes <= b.likes) ? 1 : -1).map(blog =>
        <Blog key={blog.id} blog={blog} like={like} deleteBlog={deleteBlog} user={user}/>
      )}
    </div>
  )
}

export default App