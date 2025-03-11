package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Database struct {
	mutex sync.RWMutex
	users map[string]User
	file string
}

func NewDatabase(file string) (*Database, error) {
	db := &Database{
		users: make(map[string]User),
		file: file,
	}

	if err := db.load(); err != nil {
		return nil, fmt.Errorf("failed to load database: %w", err)
	}
	return db, nil
}

func (db *Database) load() error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	file, err := os.ReadFile(db.file)
	if os.IsNotExist(err) {
		return nil
	} else if err != nil {
		return err
	} 

	return json.Unmarshal(file, &db.users)
}

func (db *Database) save() error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	data, err := json.MarshalIndent(db.users, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(db.file, data, 0644)
}

func (db *Database) CreateUser(name, email, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	db.mutex.Lock()
	defer db.mutex.Unlock()

	if _, exists := db.users[email]; exists {
		return fmt.Errorf("user already exists")
	}

	db.users[email] = User{
		Name: name, 
		Email: email,
		Password: string(hashedPassword),
	}
	
	return db.save()
}

func (db *Database) VerifyUser(email, password string) bool {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	user, exists := db.users[email]
	if !exists {
		return false
	}

	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	)

	return err == nil
}

func main() {
	db, err := NewDatabase("users.json")
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Name string `json:"name"`
			Email string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if err := db.CreateUser(request.Name, request.Email, request.Password); err != nil {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}

		w.WriteHeader(http.StatusCreated)
	})

	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Email string `json:"email"`
			Password string `json:"password"`
		}

		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if db.VerifyUser(request.Email, request.Password) {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{"status": "authenticated"})
		} else {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		}
	})

	fmt.Println("Database server running on :8080")
	http.ListenAndServe(":8080", nil)
}