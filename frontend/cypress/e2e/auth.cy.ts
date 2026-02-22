describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear any existing auth state
    cy.clearLocalStorage()
  })

  // Helper to generate unique user data for each test
  const createTestUser = () => ({
    fullName: 'Test User',
    email: `test${Date.now()}${Math.random()}@example.com`, // Unique email per test
    password: 'TestPassword123!'
  })

  it('should successfully register a new user', () => {
    const testUser = createTestUser()

    // Visit registration page
    cy.visit('/register')

    // Fill out registration form
    cy.get('#fullName').type(testUser.fullName)
    cy.get('#email').type(testUser.email)
    cy.get('#password').type(testUser.password)
    cy.get('#confirmPassword').type(testUser.password)

    // Submit form
    cy.get('button[type="submit"]').click()

    // Should redirect to applications page after successful registration
    cy.url().should('include', '/applications')
  })

  it('should show validation errors for invalid registration', () => {
    cy.visit('/register')

    // Try to submit with empty fields
    cy.get('button[type="submit"]').click()

    // Should show validation errors
    cy.contains('Name must be at least 2 characters').should('be.visible')
    cy.contains('Please enter a valid email address').should('be.visible')
    cy.contains('Password must be at least 8 characters').should('be.visible')
  })

  it('should show error for password mismatch', () => {
    cy.visit('/register')

    cy.get('#fullName').type('Test User')
    cy.get('#email').type('test@example.com')
    cy.get('#password').type('Password123!')
    cy.get('#confirmPassword').type('DifferentPassword!')

    cy.get('button[type="submit"]').click()

    // Should show password mismatch error
    cy.contains("Passwords don't match").should('be.visible')
  })

  it('should successfully login with valid credentials', () => {
    const testUser = createTestUser()

    // First, register a user
    cy.visit('/register')
    cy.get('#fullName').type(testUser.fullName)
    cy.get('#email').type(testUser.email)
    cy.get('#password').type(testUser.password)
    cy.get('#confirmPassword').type(testUser.password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/applications')

    // Logout by clearing auth and reloading
    cy.clearLocalStorage()
    cy.reload()

    // Now try to login
    cy.visit('/login')
    cy.get('#email').type(testUser.email)
    cy.get('#password').type(testUser.password)
    cy.get('button[type="submit"]').click()

    // Should redirect to applications page
    cy.url().should('include', '/applications')
  })

  it('should show error for invalid login credentials', () => {
    cy.visit('/login')

    cy.get('#email').type('wrong@example.com')
    cy.get('#password').type('WrongPassword123!')
    cy.get('button[type="submit"]').click()

    // Should show error message
    cy.contains('Invalid email or password').should('be.visible')
  })

  it('should show validation errors for empty login fields', () => {
    cy.visit('/login')

    // Try to submit with empty fields
    cy.get('button[type="submit"]').click()

    // Should show validation errors
    cy.contains('Please enter a valid email address').should('be.visible')
    cy.contains('Password is required').should('be.visible')
  })

  it('should navigate between login and register pages', () => {
    // Start at login page
    cy.visit('/login')
    cy.contains('Sign up').click()

    // Should be on register page
    cy.url().should('include', '/register')
    cy.contains('Create an account').should('be.visible')

    // Navigate back to login
    cy.contains('Sign in').click()
    cy.url().should('include', '/login')
    cy.contains('Welcome back').should('be.visible')
  })
})