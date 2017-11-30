package actions

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func BudgetItemExpensesCreate(c buffalo.Context, currentUser *models.User) error {
	expense := &models.BudgetItemExpense{}
	if err := c.Bind(expense); err != nil {
		return err
	}

	tx := c.Value("tx").(*pop.Connection)
	item, err := findBudgetItem(expense.BudgetItemId, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	expense.BudgetItemId = item.ID
	tx.Create(expense)
	return c.Render(200, r.JSON(map[string]*models.BudgetItemExpense{
		"budgetItemExpense": expense,
	}))
}

func BudgetItemExpensesUpdate(c buffalo.Context, currentUser *models.User) error {
	// find expense
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	expense := &models.BudgetItemExpense{ID: id}
	err = findBudgetItemExpense(expense, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// update
	body := JsonMap(c)
	name, ok := body["name"].(string)
	if ok {
		expense.Name = name
	}
	amount, ok := body["amount"].(json.Number)
	if ok {
		expense.Amount = amount
	}
	d := body["date"].(string)
	date, err := time.Parse("2006-01-02", d)
	if err == nil {
		expense.Date = date
	}
	tx.Update(expense)

	// render
	return c.Render(200, r.JSON(map[string]*models.BudgetItemExpense{
		"budgetItemExpense": expense,
	}))
}

func BudgetItemExpensesDelete(c buffalo.Context, currentUser *models.User) error {
	// find expense
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	expense := &models.BudgetItemExpense{ID: id}
	err = findBudgetItemExpense(expense, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// delete expense
	deleteErr := tx.Destroy(expense)
	if deleteErr != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	// render
	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findBudgetItemExpense(e *models.BudgetItemExpense, userId int, tx *pop.Connection) error {
	q := `
    select
      budget_item_expenses.id,
      budget_item_expenses.budget_item_id,
      budget_item_expenses.name,
      budget_item_expenses.amount,
      budget_item_expenses.date,
      budget_item_expenses.created_at,
      budget_item_expenses.updated_at
    from budget_item_expenses
    join budget_items on budget_items.id = budget_item_expenses.budget_item_id
    join budget_categories on budget_categories.id=budget_items.budget_category_id
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_item_expenses.id = ?
    limit 1
  `
	return tx.RawQuery(q, userId, e.ID).First(e)
}
