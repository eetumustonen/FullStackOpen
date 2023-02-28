import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog component contents', () => {
  const blog = {
    title: 'testblog',
    author: 'tester',
    url: 'testing.fi',
    likes: 3
  }

  let mockLike = jest.fn()

  test('renders correct contents in the first time', async () => {
    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('testblog by tester')
    expect(div).not.toHaveTextContent('likes')
  })

  test('after clicking "show more" url, likes and author is displayed', async () => {
    const component = render(<Blog blog={blog} like={mockLike} />)
    const user = userEvent.setup()
    const button = component.getByText('show more')
    await user.click(button)
    expect(component.container).toHaveTextContent('Title: testblog')
    expect(component.container).toHaveTextContent('URL: testing.fi')
    expect(component.container).toHaveTextContent('Likes: 3')
  })

  test('after clicking "like" twice the prop function like is called twice', async () => {
    const component = render(<Blog blog={blog} like={mockLike} />)
    const user = userEvent.setup()
    const button = component.getByText('show more')
    await user.click(button)
    const likeButton = component.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLike.mock.calls).toHaveLength(2)
  })
})
