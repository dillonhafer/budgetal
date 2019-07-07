package actions

import (
	"context"
	"fmt"
	"log"

	graphqlContext "github.com/dillonhafer/budgetal/backend/context"
	schema "github.com/dillonhafer/budgetal/backend/graphql"
	"github.com/dillonhafer/budgetal/backend/graphql/mutations"
	"github.com/dillonhafer/budgetal/backend/models"
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

	currentUser := getCurrentUserFromContext(c)
	schema, err := graphql.NewSchema(schema.BudgetalSchemaConfig)
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	ctx := context.WithValue(context.Background(), graphqlContext.CurrentUserKey, nil)
	ctx = context.WithValue(ctx, graphqlContext.BuffaloContextKey, c)

	if currentUser.ID != 0 {
		ctx = context.WithValue(ctx, graphqlContext.CurrentUserKey, currentUser)
	}

	params := graphql.Params{
		Schema:         schema,
		RequestString:  gp.Query,
		VariableValues: gp.Variables,
		Context:        ctx,
	}

	response := graphql.Do(params)

	if response.HasErrors() {
		if response.Errors[0].Message == "interface conversion: interface {} is nil, not *models.User" {
			return c.Render(401, r.JSON("You are not logged in"))
		}

		if ENV != "production" {
			err := fmt.Sprintf("Failed to execute graphql operation, errors: %+v", response.Errors)
			return c.Render(200, r.JSON(err))
		}

		return c.Render(200, r.JSON(""))
	}

	return c.Render(200, r.JSON(response))
}

func getCurrentUser(AuthenticationKey, AuthenticationToken string) *models.User {
	session := &models.Session{}
	models.DB.Where("authentication_key = ? and authentication_token = ? and expired_at is null", AuthenticationKey, AuthenticationToken).First(session)
	currentUser := &models.User{}
	models.DB.Find(currentUser, session.UserID)
	currentUser.CurrentSession = session
	return currentUser
}

func getCurrentUserFromContext(c buffalo.Context) *models.User {
	AuthenticationKey, _ := c.Cookies().Get(mutations.AUTH_COOKIE_KEY)
	AuthenticationToken := c.Request().Header.Get(mutations.AUTH_HEADER_KEY)
	return getCurrentUser(AuthenticationKey, AuthenticationToken)
}
