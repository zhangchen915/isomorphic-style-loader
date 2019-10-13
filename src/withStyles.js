/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { h/** @jsx h */ } from 'preact'
import { PureComponent, useContext } from 'preact/compat'
import StyleContext from './StyleContext'

function withStyles(...styles) {
  return function wrapWithStyles(ComposedComponent) {
    class WithStyles extends PureComponent {
      constructor(props) {
        super(props)
        const insertCss = useContext(StyleContext)
        this.removeCss = insertCss(styles)
      }

      componentWillUnmount() {
        if (this.removeCss) {
          setTimeout(this.removeCss, 0)
        }
      }

      render() {
        return <ComposedComponent {...this.props} />
      }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

    WithStyles.displayName = `WithStyles(${displayName})`
    WithStyles.contextType = StyleContext
    WithStyles.ComposedComponent = ComposedComponent

    return WithStyles
  }
}

export default withStyles
