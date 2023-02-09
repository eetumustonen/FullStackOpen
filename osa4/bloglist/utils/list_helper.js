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