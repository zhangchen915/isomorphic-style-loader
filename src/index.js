import { stringifyRequest } from 'loader-utils'

module.exports = () => {
}
module.exports.pitch = function pitch(request) {
  if (this.cacheable) {
    this.cacheable()
  }

  const insertCss = require.resolve('./insertCss.js')
  return `
    var refs = 0;
    var css = require(${stringifyRequest(this, `!!${request}`)});
    var insertCss = require(${stringifyRequest(this, `!${insertCss}`)});
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;
    
    exports = module.exports = css.locals || {};
    exports._insertCss = function() { return insertCss(css) };
    exports._toString = css.toString;
    exports._module_id = id

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && typeof window !== 'undefined' && window.document) {
      var removeCss = function() {};
     module.hot.accept(${stringifyRequest(this, `!!${request}`)}, function(){
        css = require(${stringifyRequest(this, `!!${request}`)});
        removeCss = insertCss(css);
      });
      module.hot.dispose(function () { removeCss(); })
    }
  `
}
