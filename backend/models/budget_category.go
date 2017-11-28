package models

import (
	"fmt"
	"time"

	"github.com/markbates/pop"
)

type BudgetCategory struct {
	ID         int       `json:"id" db:"id"`
	BudgetId   int       `json:"budgetId" db:"budget_id"`
	Name       string    `json:"name" db:"name"`
	Percentage string    `json:"percentage" db:"percentage"`
	CreatedAt  time.Time `json:"-" db:"created_at"`
	UpdatedAt  time.Time `json:"-" db:"updated_at"`
}

var SortOrder = map[string]int{
	"Charity":        0,
	"Saving":         1,
	"Housing":        2,
	"Utilities":      3,
	"Food":           4,
	"Clothing":       5,
	"Transportation": 6,
	"Medical/Health": 7,
	"Insurance":      8,
	"Personal":       9,
	"Recreation":     10,
	"Debts":          11,
}

type BudgetCategories []BudgetCategory

func (s BudgetCategories) Len() int {
	return len(s)
}
func (s BudgetCategories) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s BudgetCategories) Less(i, j int) bool {
	return SortOrder[s[i].Name] < SortOrder[s[j].Name]
}

func (budgetCategory *BudgetCategory) ImportPreviousItems(tx *pop.Connection) (string, BudgetItems) {
	budget := Budget{}
	tx.Find(&budget, budgetCategory.BudgetId)

	var previousMonth, previousYear int
	if budget.Month > 1 {
		previousMonth = budget.Month - 1
		previousYear = budget.Year
	} else {
		previousMonth = 12
		previousYear = budget.Year - 1
	}

	previousBudget := Budget{}
	previousBudgetCategory := BudgetCategory{}
	tx.Where(`
		user_id = ? and year = ? and month = ?
	`, budget.UserID, previousYear, previousMonth).First(&previousBudget)
	tx.BelongsTo(&previousBudget).Where(`name = ?`, budgetCategory.Name).First(&previousBudgetCategory)

	previousItems := BudgetItems{}
	tx.BelongsTo(&previousBudgetCategory).Order(`created_at`).All(&previousItems)

	newItems := BudgetItems{}
	for _, item := range previousItems {
		newItem := BudgetItem{
			BudgetCategoryId: budgetCategory.ID,
			Name:             item.Name,
			Amount:           item.Amount,
		}
		tx.Create(&newItem)
		newItems = append(newItems, newItem)
	}

	count := len(previousItems)
	message := "There was nothing to import"
	if count > 0 {
		message = fmt.Sprintf("Imported %s", pluralize(count, "item", "items"))
	}
	return message, newItems
}

func pluralize(count int, singular, plural string) string {
	word := plural
	if count == 1 {
		word = singular
	}
	return fmt.Sprintf("%d %s", count, word)
}
