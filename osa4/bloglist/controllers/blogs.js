const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if ( blog.user.toString() === user.id ) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    response.status(401).json({ error: 'unauthorized' })
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        url: body.url,
        author: body.author,
        likes: body.likes
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true} )
        response.json(updatedBlog)
    } catch (exception) {
        console.log(`error happened: ${exception}`)
    }
})

module.exports = blogRouter