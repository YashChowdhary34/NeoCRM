package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
)

// represents a simple key-value store
type DB struct {
	mu sync.RWMutex
	data map[string]string
	file string
}

// initializes a new db instance
func NewDB(file string) *DB {
	db := &DB{
		data: make(map[string]string),
		file: file,
	}
	db.load()
	return db
}

// reads the persisted data from disk
func (db *DB) load() {
	db.mu.Lock()
	defer db.mu.Unlock()
	content, err := os.ReadFile(db.file)
	if err != nil {
		log.Println("No existing database file found, starting fresh.")
		return
	}
	if err := json.Unmarshal(content, &db.data); err != nil {
		log.Println("Error loading data:", err)
	}
}

// save writes the current data to disk
func (db *DB) save() {
	content, err := json.MarshalIndent(db.data, "", "  ")
	if err != nil {
		log.Println("Error marshaling data:", err)
		return
	}
	if err := os.WriteFile(db.file, content, 0644); err != nil {
		log.Println("Error saving data:", err)
	}
}

// stores a key-value pair
func (db *DB) Set(key, value string) {
	db.mu.Lock()
	defer db.mu.Unlock()
	db.data[key] = value
	db.save()
}

// retrieves a value by key
func (db *DB) Get(key string) (string, bool) {
	db.mu.RLock()
	defer db.mu.RUnlock()
	val, ok := db.data[key]
	return val, ok
}

// removes a key-value pair
func (db *DB) Delete(key string) {
	db.mu.Lock()
	defer db.mu.Unlock()
	delete(db.data, key)
	db.save()
}

func main() {
	dbFIle := "data.json"
	if len(os.Args) > 1 {
		dbFIle = os.Args[1]
	}
	db := NewDB(dbFIle)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprintf(w, `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h3>Custom DB Service running on port 8080</h3>
								<hr/>
								<p>/set</p>
								<p>/get</p>
								<p>/delete</p>
            </body>
            </html>
        `)
	})

	// http endpoints
	http.HandleFunc("/set", func(w http.ResponseWriter, r *http.Request) {
		key := r.URL.Query().Get("key")
		value := r.URL.Query().Get("value")
		if key == "" {
			http.Error(w, "Missing key", http.StatusBadRequest)
			return
		}
		db.Set(key, value)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	http.HandleFunc("/get", func(w http.ResponseWriter, r *http.Request) {
		key := r.URL.Query().Get("key")
		if key == "" {
			http.Error(w, "Missing key", http.StatusBadRequest)
			return
		}
		if val, ok := db.Get(key); ok {
			w.Write([]byte(val))
		} else {
			http.Error(w, "Key not found", http.StatusNotFound)
		}
	})

	http.HandleFunc("/delete", func(w http.ResponseWriter, r *http.Request) {
		key := r.URL.Query().Get("key")
		if key == "" {
			http.Error(w, "Missing key", http.StatusBadRequest)
			return
		}
		db.Delete(key)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Deleted"))
	})

	log.Println("Custom DB service running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}