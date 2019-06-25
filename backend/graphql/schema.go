package graphql

import (
	"github.com/dillonhafer/budgetal/backend/graphql/mutations"
	"github.com/dillonhafer/budgetal/backend/graphql/resolvers"
	"github.com/dillonhafer/budgetal/backend/graphql/types"
	"github.com/graphql-go/graphql"
)

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"annualBudget": &graphql.Field{
			Type:        types.AnnualBudget,
			Description: "Get the annual budget for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: resolvers.AnnualBudget,
		},
	},
})

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"annualBudgetItemDelete": &graphql.Field{
			Type:        types.AnnualBudget,
			Description: "Deletes an annual budget item",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.AnnualBudgetItemDelete,
		},
		"annualBudgetItemUpdate": &graphql.Field{
			Type:        types.AnnualBudgetItem,
			Description: "Update existing annual budget item",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.AnnualBudgetItemUpdate,
		},
	},
})

// BudgetalSchemaConfig for Budgetal
var BudgetalSchemaConfig = graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
}