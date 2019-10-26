<img width="150" height="150" align="right" src="https://raw.githubusercontent.com/kriasoft/isomorphic-style-loader/8fe56ef8fba794e00bfbc9b6d731edf0f572d4e7/logo.png" />

# Preact Isomorphic CSS style loader for [Webpack](http://webpack.github.io)

[![NPM version](https://img.shields.io/npm/v/preact-isomorphic-style-loader.svg)](https://www.npmjs.com/package/isomorphic-style-loader)
[![NPM downloads](https://img.shields.io/npm/dw/preact-isomorphic-style-loader.svg)](https://www.npmjs.com/package/isomorphic-style-loader)
[![Library Size](https://img.shields.io/github/size/preact-kriasoft/isomorphic-style-loader/src/withStyles.js.svg)](https://bundlephobia.com/result?p=isomorphic-style-loader)

CSS style loader for Webpack that works similarly to
[style-loader](https://github.com/webpack/style-loader), but is optimized for
[critical path CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
rendering and also works great in the context of
[isomorphic apps](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/).
It provides two helper methods on to the `styles` object - `._insertCss()`
(injects CSS into the DOM) and `._getCss()` (returns a CSS string).

See [getting started](#getting-started) &nbsp;|&nbsp; [changelog](CHANGELOG.md) &nbsp;|&nbsp;
Join [#react-starter-kit](https://gitter.im/kriasoft/react-starter-kit)
chat room on Gitter to stay up to date

## How to Install

```bash
$ npm install preact-isomorphic-style-loader --save-dev
```

## Getting Started

**Webpack configuration:**

```js
module.exports = {
  /* ... */
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'preact-isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
  /* ... */
}
```

**Note**: Configuration is the same for both client-side and server-side bundles. For more
information visit https://webpack.js.org/configuration/module/.

**React component example:**

```css
/* App.css */
.root { padding: 10px }
.title { color: red }
```

```js
/* App.js */
import { h } from 'preact'
import withStyles from 'preact-isomorphic-style-loader/withStyles'
import s from './App.scss'

// you can use decorator @withStyles(style) and export App
function App(props, context) {
  return (
    <div className={s.root}>
      <h1 className={s.title}>Hello, world!</h1>
    </div>
  )
}

export default withStyles(s)(App)
```

See server-side rendering example below:

```js
import express from 'express'
import {h} from 'preact';
import render from 'preact-render-to-string';
import StyleContext from 'preact-isomorphic-style-loader/StyleContext'
import App from './App.js'

const server = express()
const port = process.env.PORT || 3000

// Server-side rendering of the React app
server.get('*', (req, res, next) => {
  const css = new Map()
  const insertCss = (styles) => styles.forEach(style => {
      const {id,css} = style._insertCss();
      isomorphicStyle.set(id, css)
  });
  const body = render(
    <StyleContext.Provider value={{ insertCss }}>
      <App />
    </StyleContext.Provider>
  )
  const html = `<!doctype html>
    <html>
      <head>
        <script src="client.js" defer></script>
        <style id="${id}">${css}</style>
      </head>
      <body>
        <div id="root">${body}</div>
      </body>
    </html>`
  res.status(200).send(html)
})

server.listen(port, () => {
  console.log(`Node.js app is running at http://localhost:${port}/`)
})
```
