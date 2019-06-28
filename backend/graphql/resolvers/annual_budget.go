package resolvers

import (
	"time"

	"github.com/dillonhafer/budgetal/backend/models"
	"github.com/graphql-go/graphql"
)

func allowedYear(year int) bool {
	currentYear := time.Now().Local().Year()
	return year > 2014 && year < currentYear+4
}

// AnnualBudget resolve annual budgets
func AnnualBudget(params graphql.ResolveParams) (interface{}, error) {
	currentUser := params.Context.Value("currentUser").(*models.User)

	year, isOK := params.Args["year"].(int)
	if !isOK || !allowedYear(year) {
		return nil, nil
	}

	annualBudget := models.AnnualBudget{UserID: currentUser.ID, Year: year}
	annualBudgetItems := models.AnnualBudgetItems{}
	annualBudget.FindOrCreate()
	models.DB.BelongsTo(&annualBudget).Order(`lower(name)`).All(&annualBudgetItems)
	annualBudget.AnnualBudgetItems = annualBudgetItems
	return annualBudget, nil
}
