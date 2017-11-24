package actions

import (
	"strconv"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

func AnnualBudgetsIndex(c buffalo.Context, currentUser *models.User) error {
	year, err := strconv.ParseInt(c.Param("year"), 10, 64)
	if err != nil {
		return c.Render(404, r.JSON("Not Found"))
	}

	var params = struct {
		Year   int
		UserID int
	}{
		int(year),
		currentUser.ID,
	}
	tx := c.Value("tx").(*pop.Connection)

	annualBudget := &models.AnnualBudget{UserID: params.UserID, Year: params.Year}
	annualBudgetItems := &models.AnnualBudgetItems{}

	annualBudget.FindOrCreate(tx)
	tx.BelongsTo(annualBudget).All(annualBudgetItems)

	response := map[string]*models.AnnualBudgetItems{
		"annualBudgetItems": annualBudgetItems,
	}

	return c.Render(200, r.JSON(response))
}