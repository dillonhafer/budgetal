package models

import (
	"encoding/json"
	"sort"
	"time"

	"github.com/markbates/pop"
)

type Budget struct {
	ID        int         `json:"id" db:"id"`
	UserID    int         `json:"-" db:"user_id"`
	Month     int         `json:"month" db:"month"`
	Year      int         `json:"year" db:"year"`
	Income    json.Number `json:"income" db:"monthly_income"`
	CreatedAt time.Time   `json:"-" db:"created_at"`
	UpdatedAt time.Time   `json:"-" db:"updated_at"`
}

type Budgets []Budget

func (b *Budget) FindOrCreate() error {
	err := DB.Where("user_id = ? and year = ? and month = ?", b.UserID, b.Year, b.Month).First(b)
	if err != nil {
		b.Income = json.Number("3500.00")
		err = DB.Create(b)
		err = b.CreateDefaultCategories()
	}
	return err
}

func (b *Budget) MonthlyView() (BudgetCategories, BudgetItems, BudgetItemExpenses) {
	// Load Categories
	categories := BudgetCategories{}
	DB.BelongsTo(b).All(&categories)
	sort.Sort(categories)

	// Load Items
	categoryIds := make([]interface{}, len(categories))
	for i, v := range categories {
		categoryIds[i] = v.ID
	}
	items := BudgetItems{}
	if len(categoryIds) > 0 {
		DB.Where(`budget_category_id in (?)`, categoryIds...).Order(`created_at`).All(&items)
	}

	// Load Expenses
	itemIds := make([]interface{}, len(items))
	for i, v := range items {
		itemIds[i] = v.ID
	}
	expenses := BudgetItemExpenses{}
	if len(itemIds) > 0 {
		DB.Where(`budget_item_id in (?)`, itemIds...).Order(`created_at`).All(&expenses)
	}

	return categories, items, expenses
}

func (b *Budget) CreateDefaultCategories() error {
	categories := BudgetCategories{
		BudgetCategory{BudgetId: b.ID, Name: "Charity", Percentage: "10-15%"},
		BudgetCategory{BudgetId: b.ID, Name: "Saving", Percentage: "10-15%"},
		BudgetCategory{BudgetId: b.ID, Name: "Housing", Percentage: "25-35%"},
		BudgetCategory{BudgetId: b.ID, Name: "Utilities", Percentage: "5-10%"},
		BudgetCategory{BudgetId: b.ID, Name: "Food", Percentage: "5-15%"},
		BudgetCategory{BudgetId: b.ID, Name: "Clothing", Percentage: "2-7%"},
		BudgetCategory{BudgetId: b.ID, Name: "Transportation", Percentage: "10-15%"},
		BudgetCategory{BudgetId: b.ID, Name: "Medical/Health", Percentage: "5-10%"},
		BudgetCategory{BudgetId: b.ID, Name: "Insurance", Percentage: "10-25%"},
		BudgetCategory{BudgetId: b.ID, Name: "Personal", Percentage: "5-10%"},
		BudgetCategory{BudgetId: b.ID, Name: "Recreation", Percentage: "5-10%"},
		BudgetCategory{BudgetId: b.ID, Name: "Debts", Percentage: "0%"},
	}

	// Transactionally create categories
	return DB.Transaction(func(tx *pop.Connection) error {
		for _, c := range categories {
			err := tx.Create(&c)
			if err != nil {
				return err
			}
		}
		return nil
	})
}
