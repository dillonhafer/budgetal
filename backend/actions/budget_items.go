package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func BudgetItemsCreate(c buffalo.Context, currentUser *models.User) error {
	item := &models.BudgetItem{}
	if err := c.Bind(item); err != nil {
		return err
	}

	// Find Category
	tx := c.Value("tx").(*pop.Connection)
	category, err := findBudgetCategory(item.BudgetCategoryId, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// Create
	item.BudgetCategoryId = category.ID
	createErr := tx.Create(item)
	if createErr != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// render
	return c.Render(200, r.JSON(map[string]*models.BudgetItem{
		"budgetItem": item,
	}))
}

func BudgetItemsUpdate(c buffalo.Context, currentUser *models.User) error {
	// find item
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	item := &models.BudgetItem{ID: id}
	err = findBudgetItem(item, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	if err := c.Bind(item); err != nil {
		return err
	}

	// update
	updateErr := tx.Update(item)
	if updateErr != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// render
	return c.Render(200, r.JSON(map[string]*models.BudgetItem{
		"budgetItem": item,
	}))
}

func BudgetItemsDelete(c buffalo.Context, currentUser *models.User) error {
	// find item
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	tx := c.Value("tx").(*pop.Connection)
	item := &models.BudgetItem{ID: id}
	err = findBudgetItem(item, currentUser.ID, tx)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	// delete expenses
	expenseDeleteErrors := item.DestroyAllExpenses(tx, c.Logger())
	if expenseDeleteErrors != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	// delete item
	deleteErr := tx.Destroy(item)
	if deleteErr != nil {
		return c.Render(422, r.JSON(map[string]bool{"ok": false}))
	}

	// render
	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func findBudgetCategory(categoryID, userId int, tx *pop.Connection) (models.BudgetCategory, error) {
	c := models.BudgetCategory{}
	q := `
    select budget_categories.*
      from budget_categories
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_categories.id = ?
    limit 1
  `
	err := tx.RawQuery(q, userId, categoryID).First(&c)
	return c, err
}

func findBudgetItem(i *models.BudgetItem, userId int, tx *pop.Connection) error {
	q := `
    select
      budget_items.id,
      budget_items.budget_category_id,
      budget_items.name,
      budget_items.amount_budgeted,
      budget_items.created_at,
      budget_items.updated_at
    from budget_items
    join budget_categories on budget_categories.id=budget_items.budget_category_id
    join budgets on budget_categories.budget_id = budgets.id
    where budgets.user_id = ?
    and budget_items.id = ?
    limit 1
  `
	err := tx.RawQuery(q, userId, i.ID).First(i)
	return err
}