package main

import (
	"log"
	"swmpool/models"
	"swmpool/routers"
)

func main() {

	models.ConnectDatabase()

	r := routers.SetupRouter()

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
