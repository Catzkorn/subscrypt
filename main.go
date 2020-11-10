package main

import (
	"log"
	"net/http"
)

type InMemorySubscriptionStore struct{}

func (i *InMemorySubscriptionStore) GetSubscriptions() string {
	return "test"
}

func main() {
	server := NewSubscriptionServer(&InMemorySubscriptionStore{})
	if err := http.ListenAndServe(":5000", server); err != nil {
		log.Fatalf("could not listen on port 5000 %v", err)
	}
}