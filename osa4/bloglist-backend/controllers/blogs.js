const router = require('express').Router()
const Blog = require('../models/blog')

const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  console.log('GET request')
  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  console.log('POST request')
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title, author, url, 
    likes: likes ? likes : 0
  })
  
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  blog.user = user._id

  const createdBlog = await blog.save()

  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()

  response.status(201).json(createdBlog)
})

router.put('/:id', async (request, response) => {
  const { title, url, author, likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,  { title, url, author, likes }, { new: true })

  response.json(updatedBlog)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  console.log(blog.user.toString())
  console.log(user.id.toString())
  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString() )

  await user.save()
  await blog.remove()
  console.log('DELETE request')
  response.status(204).end()
})

module.exports = router