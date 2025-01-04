.PHONY: build
build:
	@echo "Building the site..."
	@go run main.go

.PHONY: clean
clean:
	@echo "Cleaning up..."
	@rm -rf dist
