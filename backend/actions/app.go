package actions

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/airbrake/gobrake"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/middleware"
	"github.com/gobuffalo/envy"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/x/sessions"
)

var AUTH_HEADER_KEY = envy.Get("BUDGETAL_HEADER", "X-Budgetal-Session")
var AUTH_COOKIE_KEY = envy.Get("BUDGETAL_COOKIE", "_budgetal_session")
var COOKIE_DOMAIN = envy.Get("COOKIE_DOMAIN", "api.budgetal.com")

var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App
var StartTime = time.Now()

func WithCurrentUser(next func(buffalo.Context, *models.User) error) func(buffalo.Context) error {
	return func(c buffalo.Context) error {
		currentUser := c.Value("currentUser").(*models.User)
		return next(c, currentUser)
	}
}

func AuthorizeUser(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		errResp := map[string]string{"error": "You are not signed in"}
		// 1. Rebuild keys
		AuthenticationKey, err := c.Cookies().Get(AUTH_COOKIE_KEY)
		if err != nil {
			c.Logger().Debug("Cookie not found")
			return c.Render(401, r.JSON(errResp))
		}
		AuthenticationToken := c.Request().Header.Get(AUTH_HEADER_KEY)

		// 2. Get user from keys or 401
		session := &models.Session{}
		dbErr := models.DB.Where("authentication_key = ? and authentication_token = ? and expired_at is null", AuthenticationKey, AuthenticationToken).First(session)
		if dbErr != nil {
			c.Logger().Debug("Session not found or expired")
			return c.Render(401, r.JSON(errResp))
		}

		user := &models.User{}
		dbErr = models.DB.Find(user, session.UserID)
		if dbErr != nil {
			c.Logger().Debug("User not found")
			return c.Render(401, r.JSON(errResp))
		}

		user.CurrentSession = session

		c.Set("currentUser", user)
		return next(c)
	}
}

func App() *buffalo.App {

	if app == nil {
		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
			PreWares:     []buffalo.PreWare{CorsPreware().Handler},
		})

		airbrakeProjectID, useAirbrake := os.LookupEnv("AIRBRAKE_PROJECT_ID")

		var airbrake *gobrake.Notifier
		if useAirbrake {
			projectID, err := strconv.ParseInt(airbrakeProjectID, 0, 64)
			if err != nil {
				log.Fatal(err)
			}

			airbrake = gobrake.NewNotifierWithOptions(&gobrake.NotifierOptions{
				ProjectId:   projectID,
				ProjectKey:  os.Getenv("AIRBRAKE_API_KEY"),
				Environment: os.Getenv("GO_ENV"),
			})
		}

		app.ErrorHandlers[500] = func(status int, err error, c buffalo.Context) error {
			if airbrake != nil {
				airbrake.Notify(err, nil)
			}
			c.Logger().Errorf("\n[500] ERROR:\n%v\n\n", err)
			ErrorNotification(err, c)

			errResp := map[string]string{"error": "Something went wrong on our end. We are looking into the issue"}
			return c.Render(500, r.JSON(errResp))
		}

		if ENV == "development" {
			app.Use(middleware.ParameterLogger)
		}

		// Authorization
		app.Use(AuthorizeUser)

		// Non-authorized routes
		app.Middleware.Skip(AuthorizeUser, SignIn, RegisterUser, PasswordResetRequest, ResetPassword)
		app.POST("/sign-in", SignIn)
		app.POST("/register", RegisterUser)
		app.POST("/reset-password", PasswordResetRequest)
		app.PUT("/reset-password", ResetPassword)

		//
		// Authorized routes
		//
		////////////////////

		// Monthly Statistics
		app.GET("/monthly-statistics/{year}/{month}", WithCurrentUser(MonthlyStatisticsShow))

		// Annual Budgets
		app.GET("/annual-budgets/{year}", WithCurrentUser(AnnualBudgetsIndex))
		app.POST("/annual-budget-items", WithCurrentUser(AnnualBudgetItemsCreate))
		app.PUT("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsUpdate))
		app.DELETE("/annual-budget-items/{id}", WithCurrentUser(AnnualBudgetItemsDelete))

		// Users
		app.PATCH("/update-user", WithCurrentUser(UsersUpdate))
		app.PUT("/update-user", WithCurrentUser(UsersUpdate))
		app.PATCH("/update-password", WithCurrentUser(UsersChangePassword))
		app.PUT("/update-push-notification-token", WithCurrentUser(UsersUpdatePushNotificationToken))

		// Admin
		app.GET("/admin/users", WithCurrentUser(AdminUsers))
		app.GET("/admin/server-info", WithCurrentUser(AdminServerInfo))
		app.GET("/admin/test-email", WithCurrentUser(AdminTestEmail))
		app.GET("/admin/error", WithCurrentUser(AdminErrorPage))
		app.POST("/admin/test-push-notification", WithCurrentUser(AdminTestPushNotification))

		// Sessions
		app.GET("/sessions", WithCurrentUser(SessionsIndex))
		app.DELETE("/sign-out", WithCurrentUser(SignOut))
		app.DELETE("/sessions/{authenticationKey}", WithCurrentUser(SessionsDelete))

		// Budgets
		app.GET("/budgets/{year}/{month}", WithCurrentUser(BudgetsIndex))
		app.PUT("/budgets/{year}/{month}", WithCurrentUser(BudgetsUpdate))

		// Budget Categories
		app.POST("/budget-categories/{id}/import", WithCurrentUser(BudgetCategoryImport))

		// Budget Items
		app.POST("/budget-items", WithCurrentUser(BudgetItemsCreate))
		app.PUT("/budget-items/{id}", WithCurrentUser(BudgetItemsUpdate))
		app.DELETE("/budget-items/{id}", WithCurrentUser(BudgetItemsDelete))

		// Budget Item Expenses
		app.POST("/budget-item-expenses", WithCurrentUser(BudgetItemExpensesCreate))
		app.PUT("/budget-item-expenses/{id}", WithCurrentUser(BudgetItemExpensesUpdate))
		app.DELETE("/budget-item-expenses/{id}", WithCurrentUser(BudgetItemExpensesDelete))
		// Autocomplete
		app.GET("/past-expenses/{name}", WithCurrentUser(PastExpenses))

		// Net Worth
		app.GET("/net-worths/{year}", WithCurrentUser(NetWorthsIndex))
		app.POST("/net-worths/{year}/{month}/import", WithCurrentUser(NetWorthsImport))

		// Net Worth Items
		app.POST("/net-worths/{year}/{month}/net-worth-items", WithCurrentUser(NetWorthItemsCreate))
		app.PATCH("/net-worth-items/{id}", WithCurrentUser(NetWorthItemsUpdate))
		app.DELETE("/net-worth-items/{id}", WithCurrentUser(NetWorthItemsDelete))

		// Assets and Liabilities
		app.POST("/assets-liabilities", WithCurrentUser(AssetsLiabilitiesCreate))
		app.PATCH("/assets-liabilities/{id}", WithCurrentUser(AssetsLiabilitiesUpdate))
		app.DELETE("/assets-liabilities/{id}", WithCurrentUser(AssetsLiabilitiesDelete))
	}

	return app
}
