describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Eetu Mustonen',
      username: 'eetmus',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('form').contains('username')
    cy.get('form').contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('eetmus')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('logged in as Eetu Mustonen')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('eetmus')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('eetmus')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('logged in as Eetu Mustonen')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('testing with cypress')
      cy.get('#author').type('Mr. Tester')
      cy.get('#url').type('testing.fi')
      cy.get('#new-blog-button').click()

      cy.contains('A new blog added: testing with cypress by Mr. Tester')
      cy.get('ul').contains('testing with cypress by Mr. Tester')
    })

    describe('and when there is a blog', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('#title').type('testing with cypress')
        cy.get('#author').type('Mr. Tester')
        cy.get('#url').type('testing.fi')
        cy.get('#new-blog-button').click()
      })

      it('a blog can be liked', function() {
        cy.contains('testing with cypress')
          .contains('show more')
          .click()
        cy.contains('testing with cypress')
          .contains('like')
          .click()
        cy.contains('testing with cypress')
          .contains('Likes: 1')
      })

      it.only('a blog can be deleted', function() {
        cy.contains('testing with cypress')
          .contains('show more')
          .click()
        cy.contains('testing with cypress')
          .contains('delete')
          .click()
      })
    })
  })
})