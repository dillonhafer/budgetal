package models

import (
	"encoding/json"
	"time"

	"github.com/markbates/pop"
	"github.com/markbates/validate"
)

type User struct {
	ID                int       `json:"-" db:"id"`
	Email             string    `json:"email" db:"email"`
	FirstName         string    `json:"firstName" db:"first_name"`
	LastName          string    `json:"lastName" db:"last_name"`
	Admin             bool      `json:"admin" db:"admin"`
	AvatarFileName    string    `json:"avatarFileName" db:"avatar_file_name"`
	EncryptedPassword string    `json:"-" db:"encrypted_password"`
	PasswordSalt      string    `json:"-" db:"password_salt"`
	CreatedAt         time.Time `json:"-" db:"created_at"`
	UpdatedAt         time.Time `json:"-" db:"updated_at"`
}

// String is not required by pop and may be deleted
func (u User) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}

// Users is not required by pop and may be deleted
type Users []User

// String is not required by pop and may be deleted
func (u Users) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (u *User) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (u *User) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (u *User) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
