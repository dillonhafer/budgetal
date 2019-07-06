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
		"currentUser": &graphql.Field{
			Type:        graphql.NewNonNull(types.User),
			Description: "Get the current logged in user",
			Resolve:     resolvers.CurrentUser,
		},
		"annualBudget": &graphql.Field{
			Type:        graphql.NewNonNull(types.AnnualBudget),
			Description: "Get the annual budget for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.AnnualBudget,
		},
		"budget": &graphql.Field{
			Type:        graphql.NewNonNull(types.Budget),
			Description: "Get the budget for a given month",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"month": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.Budget,
		},
		"monthlyStatistic": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(types.MonthlyStatistic))),
			Description: "Get the statistics of a budget for a given month",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"month": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.MonthlyStatistic,
		},
		"netWorth": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(types.NetWorth))),
			Description: "Get the networth for a given year",
			Args: graphql.FieldConfigArgument{
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: resolvers.NetWorth,
		},
		"assets": &graphql.Field{
			Type:        graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(types.AssetLiability))),
			Description: "Get the assets and liabilities for a user",
			Resolve:     resolvers.AssetsLiabilities,
		},
	},
})

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"budgetIncomeUpdate": &graphql.Field{
			Type:        graphql.NewNonNull(types.Budget),
			Description: "Update the income for a budget",
			Args: graphql.FieldConfigArgument{
				"month": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"year": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"income": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Float),
				},
			},
			Resolve: mutations.BudgetIncomeUpdate,
		},
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
		"annualBudgetItemUpsert": &graphql.Field{
			Type:        types.AnnualBudgetItem,
			Description: "Upserts an annual budget item",
			Args: graphql.FieldConfigArgument{
				"annualBudgetItemInput": &graphql.ArgumentConfig{
					Type: types.AnnualBudgetItemInput,
				},
			},
			Resolve: mutations.AnnualBudgetItemUpsert,
		},
		"budgetCategoryImport": &graphql.Field{
			Type:        graphql.NewNonNull(types.BudgetCategoryImport),
			Description: "Imports budget categories from a previous budget",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.BudgetCategoryImport,
		},
		"budgetItemDelete": &graphql.Field{
			Type:        graphql.NewNonNull(types.BudgetItem),
			Description: "Deletes a budget item",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: mutations.BudgetItemDelete,
		},
		"budgetItemUpsert": &graphql.Field{
			Type:        types.BudgetItem,
			Description: "Upserts a budget item",
			Args: graphql.FieldConfigArgument{
				"budgetItemInput": &graphql.ArgumentConfig{
					Type: types.BudgetItemInput,
				},
			},
			Resolve: mutations.BudgetItemUpsert,
		},
		"signOut": &graphql.Field{
			Type:        types.User,
			Description: "Sign out the current user",
			Resolve:     mutations.SignOut,
		},
	},
})

// BudgetalSchemaConfig for Budgetal
var BudgetalSchemaConfig = graphql.SchemaConfig{
	Query:    rootQuery,
	Mutation: rootMutation,
}
