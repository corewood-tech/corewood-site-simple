# Corewood Site Simple

This repo began as output from https://claude.ai

This has been iterated on significantly, to the point that shared templating was required. There was no need to introduce a generator / framework just yet, as we don't need full theming and full content management. 

To keep things as simple as possible, and to support multiple domains and faciliate authoring more content, we added a simple `main.go` for packaging & dev-previewing the site.

All utility functions are captured in the [`Makefile`](./Makefile).

## Resume Page

This page uses hard-coded logic in the html to add some pizazz. The `data-skill-ids` list corresponds to a `data-skill-id` in the skills lis. This is manipulated with the JavaScript for the resume page.

Likewise, the references carousel js is in `assets/scripts/resume.js`.
