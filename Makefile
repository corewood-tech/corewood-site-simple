.PHONY: build
build:
	@echo "Building the site..."
	@go run main.go

.PHONY: clean
clean:
	@echo "Cleaning up..."
	@rm -rf dist


.PHONY: watch
watch:
	@make watch_src & make watch_assets

.PHONY: watch_src
watch_src:
	@echo "Watching for changes..."
	@fswatch -ort --latency=3 src | xargs -n1 -I{} make build

.PHONY: watch_assets
watch_assets:
	@echo "Watching for changes..."
	@fswatch -ort --latency=3 assets | xargs -n1 -I{} make build

## Required for watch
.PHONY: install_fswatch
install_fswatch:
	@echo "Installing fswatch..."
	@brew install fswatch
