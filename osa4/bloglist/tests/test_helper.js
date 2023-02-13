const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    id:"5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id:"5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}
const blogById = async (id) => {
  const blog = await Blog.find( {_id: id} )
  return blog[0]
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, blogById, usersInDb
}


//tehtävät osasta 4a kommentoitu
/*
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likes = blogs.map(blog => blog.likes)

  return likes.reduce(reducer, 0)
}

const favouriteBlog = (blogs => {
  if(blogs.length === 0){
    return null
  }
  let currentFavourite = blogs[0]
  for(let blog of blogs){
    if(blog.likes > currentFavourite.likes){
      currentFavourite = blog
    }
  }
  return {
    title: currentFavourite.title,
    author: currentFavourite.author,
    likes: currentFavourite.likes
  }
})
  
module.exports = {
  dummy, totalLikes, favouriteBlog
}
*/