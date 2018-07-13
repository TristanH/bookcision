# Bookcision

Created by [Ryan Norbauer](http://ryan.norbauer.com/)

Maintained by [Readwise](https://readwise.io)

When highlights and notes are created on any Kindle device, they are synced up to Amazon's cloud. These are then visible at read.amazon.com, but there is no reason to believe that Amazon will continue to provide this service forever, and our ability to work with text in that hosted browser-based environment is limited. This is a bookmarklet that permits one to excise notes/highlights from read.amazon.com. It yields a single page of cleanly styled notes/highlights, which can then be copied to one's clipboard and pasted into a local text repository (OneNote, Evernote, DevonThink, etc.). The highlights and notes can also be downloaded in a number of formats (e.g. JSON).

# Contributing

## Workflow

### Setting up project for development

  1. git clone the project locally.
  1. Ensure you're using Node 0.10.35 (we recommend using [nvm](https://github.com/creationix/nvm) to do this)
  1. npm install

### Installing a module

rm npm-shrinkwrap.json & npm i [MODULE] --save & npm shrinkwrap


### Compiling changes locally
Run `grunt build` -- dest/bookcision.js will be the compiled, working bookmarklet.

### Releasing a new version (for maintainers)

  1. Bump the version number of Bookcision in package.json
  1. Run `grunt build`
  1. Copy dest/bookcision.js to dist/bookcision.js (replacing the old version)
  1. That's it! The new version will be at dist/bookcision.js and automatically updated via Github's CDN as soon as the change is merged into master.
