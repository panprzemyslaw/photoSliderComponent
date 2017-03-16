<h1>Photo Slider Component</h1>

<img src="http://przemekzakoscielny.com/mytmp/projects/photoSliderComponent/photoSlider.png" alt="Photo Slider Component"/>

# About
This is Photo Slider Component I created using AngularJS 1.5.6 + ES6

# Getting Started
## Dependencies
Tools needed to run this app:
* `node` and `npm`
Once you have these, install the following as globals:
`npm install -g gulp karma karma-cli webpack`

## Installing
* `fork` this repo
* `clone` your fork
* `npm install -g gulp karma karma-cli webpack` install global cli dependencies
* `npm install` to install dependencies

## Testing Setup
All tests are also written in ES6. This is testing stack:
* Karma
* Webpack + Babel
* Jasmine

To run tests, type `npm test` or `karma start` in the terminal.

### Gulp Tasks
Here's a list of available tasks:
* `webpack`
  * runs Webpack, which will transpile, concatenate, and compress (collectively, "bundle") all assets and modules into `dist/bundle.js`. It also prepares `index.html` to be used as application entry point, links assets and created dist version of our application.
* `serve`
  * starts a dev server via `webpack-dev-server`, serving the client folder.
* `watch`
  * alias of `serve`
* `default` (which is the default task that runs when typing `gulp` without providing an argument)
	* runs `serve`.
  
### Testing
To run the tests, run `npm test` or `karma start`.


