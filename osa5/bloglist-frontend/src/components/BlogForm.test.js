import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('When adding a new blog', () => {
  test('sending the form with inputs works with correct inputs', async () => {
    const user = userEvent.setup()
    const mockCreate = jest.fn()
    const { container } = render(<BlogForm createBlog={mockCreate}/>)
    const titleInput = container.querySelector('#title')
    const authorInput = container.querySelector('#author')
    const sendButton = screen.getByText('add')
    await user.type(titleInput, 'testing title')
    await user.type(authorInput, 'tester')
    await user.click(sendButton)
    expect(mockCreate.mock.calls).toHaveLength(1)
    expect(mockCreate.mock.calls[0][0].title).toBe('testing title')
    expect(mockCreate.mock.calls[0][0].author).toBe('tester')
  })
})