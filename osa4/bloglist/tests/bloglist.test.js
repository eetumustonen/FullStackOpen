const listHelper = require('./test_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.initialBlogs)
})

describe('when there is some blogs in the database', () => {
  test('correct amount of blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(listHelper.initialBlogs.length)
  })
  
  test('blogs are identified by a field called id', async () => {
    const blogs = await listHelper.blogsInDb()
    const blog = blogs[0]
    expect(blog.id).toBeDefined()
  })
})

describe('when customizing the blog db', () => {
  test('a new blog can be added', async () => {
    const newBlog = {
      title: 'new blog for testing',
      author:'Eetu',
      url:'testing.fi',
      likes: 3
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(listHelper.initialBlogs.length + 1) 
    const authors = blogsAtEnd.map(b => b.author)
    expect(authors).toContain('Eetu')
  })
  
  test('if no likes are given in the request default value 0 is used', async () => {
    const newBlog = {
      title: 'another testing blog',
      author:'Mr. Tester',
      url:'testing.fi'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogs = await listHelper.blogsInDb()
    const thisBlog = blogs.find(b => b.author === 'Mr. Tester')
    expect(thisBlog.likes).toBe(0)
  })
  
  test('if no title or url are given in the request the response status code is 400', async () => {
    const noTitle = {
      author: 'Pekka',
      url: 'pekka.fi'
    }
    const noUrl = {
      title: 'testing in progress',
      author: 'tester5000'
    }
    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(400)
    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(400)
  })
  
  test('deleting a blog', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const deleteThis = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${deleteThis.id}`)
      .expect(204)
    const blogsAtEnd = await listHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      listHelper.initialBlogs.length - 1
    )
    const titles = blogsAtEnd.map(t => t.title)
    expect(titles).not.toContain(deleteThis.title)
  })
  
  test('updating likes works as expected', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const updateThis = blogsAtStart[0]
    const likesAtStart = updateThis.likes
    
    const updatedBlog = {
      ...updateThis,
      likes: updateThis.likes + 1
    }
    await api
      .put(`/api/blogs/${updateThis.id}`)
      .send(updatedBlog)
      .expect(200)
    const updated = await listHelper.blogById(updateThis.id)
    const likesAtEnd = updated.likes
    expect(likesAtEnd).toBe(likesAtStart + 1)
  })
})


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when the username is less than 3 characters and the response contains a proper error message', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'x',
      name: 'Mr X',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(`\`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3)`)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when the username is missing and the response contains a proper error message', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      name: 'Mr X',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(`\`username\` is required`)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when the password is less than 3 characters and the response contains a proper error message', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'herraX',
      name: 'Mr X',
      password: 's',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is less than the required length (3)')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when the password is missing and the response contains a proper error message', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'herraX',
      name: 'Mr X'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password missing')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})


//tehtävät osasta 4a on kommentoitu
/*
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    const blogs = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
        }
    ]

    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('of multiple blogs is their likes\' sum', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(24)
    })

    test('of a bloglist of size one is the amount of that one blog\'s likes', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(5)
    })
    

})

describe('favourite blog', () => {
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
  ]

  test('should be the one with most likes', () => {
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })
})
*/