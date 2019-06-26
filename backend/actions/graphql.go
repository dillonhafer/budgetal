package actions

import (
	"context"
	"fmt"
	"log"

	schema "github.com/dillonhafer/budgetal/backend/graphql"
	"github.com/gobuffalo/buffalo"
	"github.com/graphql-go/graphql"
)

type graphqlParams struct {
	Query     string                 `form:"query"`
	Operation string                 `json:"operationName"`
	Variables map[string]interface{} `json:"variables"`
}

// Graphql is The Graphql Endpoint
func Graphql(c buffalo.Context) error {
	// Read POST body
	gp := &graphqlParams{}
	if err := c.Bind(gp); err != nil {
		return err
	}

	currentUser := GetCurrentUserFromContext(c)
	schema, err := graphql.NewSchema(schema.BudgetalSchemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	ctx := context.WithValue(context.Background(), "currentUser", nil)
	if currentUser.ID != 0 {
		ctx = context.WithValue(context.Background(), "currentUser", currentUser)
	}

	params := graphql.Params{
		Schema:         schema,
		RequestString:  gp.Query,
		VariableValues: gp.Variables,
		Context:        ctx,
	}

	response := graphql.Do(params)

	if response.HasErrors() {
		if ENV != "production" {
			if response.Errors[0].Message == "interface conversion: interface {} is nil, not *models.User" {
				return c.Render(200, r.JSON("You are not logged in"))
			}
			err := fmt.Sprintf("Failed to execute graphql operation, errors: %+v", response.Errors)
			return c.Render(200, r.JSON(err))
		}

		return c.Render(200, r.JSON(""))
	}

	return c.Render(200, r.JSON(response))
}
