// describe('Expense App', () => {
//   beforeEach(() => {
//     // Perform login
//     cy.visit('http://localhost:4200/login');
//     cy.get('#username').type('rash');
//     cy.get('#password').type('pwd1234');
//     cy.get('form').submit();

//     // Wait for login and navigate to the dashboard after successful login
//     cy.url().should('include', '/dashboard');
//     cy.contains('User Dashboard').should('be.visible');
//   });

//   it('should add an expense for the selected month and budget', () => {
//     // Navigate to the Expenses page from the dashboard
//     cy.contains('Expenses').click();

//     // Click the 'Add Expense' button
//     cy.contains('Add Expense').click();

//     // Select the desired month for the expense
//     const selectedMonth = 'January';
//     cy.get('#selectedMonth').select(selectedMonth);
//     cy.get('#selectedMonth').should('have.value', selectedMonth);

//     // Fetch the budgets for the selected month
//     cy.get('#selectedMonth').trigger('change');

//     // Select the budget criteria
//     const selectedBudget = 'Groceries';
//     cy.get('#selectedBudget').select(selectedBudget);
//     cy.get('#selectedBudget').should('have.value', selectedBudget);

//     // Enter the expense amount without leading zeros
//     const expenseAmount = '100';
//     cy.get('#expense').type(expenseAmount);
//     cy.get('#expense').should('have.value', '0100');

//     // Submit the form to add the expense
//     cy.get('form').submit();

//   });
// });



describe('Expense App', () => {
  before(() => {
    cy.eyesOpen({
      appName: 'my-budget-app',
      apiKey: 'btadZcX1xjBIYjpCh99Lb8H2CSX0RosoSSHh7Z104mHY2s110',
    });
  });

  it('should add an expense for the selected month and budget', () => {
    cy.visit('http://localhost:4200/login');
    cy.get('#username').type('rash');
    cy.get('#password').type('pwd1234');
    cy.get('form').submit();

    cy.url().should('include', '/dashboard');
    cy.contains('User Dashboard').should('be.visible');

    cy.contains('Expenses').click();
    cy.contains('Add Expense').click();

    const selectedMonth = 'January';
    cy.get('#selectedMonth').select(selectedMonth);
    cy.get('#selectedMonth').should('have.value', selectedMonth);
    cy.get('#selectedMonth').trigger('change');

    const selectedBudget = 'Groceries';
    cy.get('#selectedBudget').select(selectedBudget);
    cy.get('#selectedBudget').should('have.value', selectedBudget);

    const expenseAmount = '100';
    cy.get('#expense').type(expenseAmount);
    cy.get('#expense').should('have.value', '0100');

    cy.eyesCheckWindow({
      tag: 'Add Expense',
    });

    cy.get('form').submit();
  });

  after(() => {
    cy.eyesClose();
  });
});