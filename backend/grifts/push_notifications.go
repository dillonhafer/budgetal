package grifts

import (
	"fmt"
	"strconv"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/models"
	"github.com/gobuffalo/envy"
	. "github.com/markbates/grift/grift"
)

var _ = Desc("new-month-reminders", "Remind users to create a budget")
var _ = Set("new-month-reminders", func(c *Context) error {
	daysLeft, _ := strconv.Atoi(envy.Get("days", "10"))
	left := daysLeftInMonth()

	if left != daysLeft {
		return nil
	}

	users := models.Users{}
	models.DB.Where(`push_notification_tokens != array[]::text[]`).All(&users)
	fmt.Printf("Sending notifications to %d users\n", len(users))

	title := "⏰💵 Budget Time"
	body := "A new month deserves a new budget"
	for _, user := range users {
		user.SendPushNotification(title, body)
	}

	return nil
})

func daysLeftInMonth() int {
	now := time.Now()
	currentYear, currentMonth, _ := now.Date()
	currentLocation := now.Location()

	firstOfMonth := time.Date(currentYear, currentMonth, 1, 0, 0, 0, 0, currentLocation)
	lastOfMonth := firstOfMonth.AddDate(0, 1, -1)

	diff := lastOfMonth.Sub(now)
	return int(diff.Hours() / 24) // number of days
}
