# Bookcision

http://www.norbauer.com/bookcision/

http://twitter.com/NorbauerApps

When highlights and notes are created on any Kindle device, they are synced up to Amazon's cloud. These are then visible at read.amazon.com, but there is no reason to believe that Amazon will continue to provide this service forever, and our ability to work with text in that hosted browser-based environment is limited. This is a bookmarklet that permits one to excise notes/highlights from read.amazon.com. It yields a single page of cleanly styled notes/highlights, which can then be copied to one's clipboard and pasted into a local text repository (OneNote, Evernote, DevonThink, etc.). The highlights and notes can also be downloaded in a number of formats (e.g. JSON).

# Contributing

## Workflow

### Setting up project for development

  1. hg clone the project locally.
  1. npm install
  1. Copy *.example.json to *.json and fill in real credentials.

### Installing a module

rm npm-shrinkwrap.json & npm i [MODULE] --save & npm shrinkwrap

### Updating all packages

........

### Releasing a version

  1. Commit code with a sensible comment.
  1. `grunt release:prerelease` to:
    1. Increment the version number (using `npm version prerelease`).
    1. Commit the change to the repository.
    1. Publish to Azure (but not the directory served publicly).
    1. Notify Rollbar of the new sourcemap to download.

    or `grunt release:major`, `release:minor`, or `release:patch` to perform the steps above and additionally release live (publish to the 'latest' directory in Azure).

### Testing CORS support on Azure

```
Preflight request:
curl -H "Origin: https://read.amazon.com" -H "Access-Control-Request-Method: GET" -i -X OPTIONS --verbose http://norbauercdn.blob.core.windows.net/bookcision/latest/bookcision.js
```
```
curl -H "Origin: https://read.amazon.com" --verbose http://norbauercdn.blob.core.windows.net/bookcision/latest/bookcision.js
```