// Package main provides a static site generator that processes HTML templates
// for multiple domains.
package main

import (
	"fmt"
	cp "github.com/otiai10/copy"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

// URLs to generate sites for
var urls = []string{
	"https://corewood.info",
	"https://corewood.cloud",
	"https://corewood.io",
	"https://corewood.tech",
}

// Page represents the data passed to templates
type Page struct {
	URL string
}

const (
	headerTemplate = "src/partials/header.tmpl"
	footerTemplate = "src/partials/footer.tmpl"
	templateDir    = "src/templates"
	outputBaseDir  = "dist"
	assetsDir      = "assets"
)

func main() {
	if err := processTemplates(); err != nil {
		fmt.Fprintf(os.Stderr, "Error processing templates: %v\n", err)
		os.Exit(1)
	}
}

func processTemplates() error {
	items, err := os.ReadDir(templateDir)
	if err != nil {
		return fmt.Errorf("reading template directory: %w", err)
	}

	for _, item := range items {
		if err := processTemplate(item); err != nil {
			return fmt.Errorf("processing template %s: %w", item.Name(), err)
		}
	}
	return nil
}

func processTemplate(item os.DirEntry) error {
	targetName := strings.TrimSuffix(item.Name(), ".tmpl")

	for _, url := range urls {
		page := Page{URL: url}
		suffix := strings.Split(url, ".")[1]
		outputDir := filepath.Join(outputBaseDir, suffix)

		if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
			return fmt.Errorf("creating output directory: %w", err)
		}

		outputPath := filepath.Join(outputDir, targetName)
		if err := generatePage(outputPath, targetName, page); err != nil {
			return fmt.Errorf("generating page for %s: %w", url, err)
		}
		if err := copyAssets(outputDir); err != nil {
			return fmt.Errorf("copying assets for %s: %w", url, err)
		}
	}
	return nil
}

func generatePage(outputPath string, targetName string, page Page) error {
	out, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("creating output file: %w", err)
	}
	defer out.Close()

	tmpl, err := template.New(targetName).ParseFiles(headerTemplate, filepath.Join(templateDir, targetName+".tmpl"), footerTemplate)
	if err != nil {
		return fmt.Errorf("parsing templates: %w", err)
	}

	// Execute each template section
	templates := []string{"header.tmpl", targetName + ".tmpl", "footer.tmpl"}
	for _, t := range templates {
		if err := tmpl.ExecuteTemplate(out, t, page); err != nil {
			return fmt.Errorf("executing template %s: %w", t, err)
		}
	}

	return nil
}

func copyAssets(outputPath string) error {
	dirs, e := os.ReadDir(assetsDir)
	if e != nil {
		panic(e)
	}

	for _, dir := range dirs {
		if err := cp.Copy(filepath.Join(assetsDir, dir.Name()), filepath.Join(outputPath, dir.Name())); err != nil {
			return fmt.Errorf("copying assets: %w", err)
		}
	}
	return nil
}
