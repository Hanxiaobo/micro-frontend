import './public-path'
import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )
// ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
function render(props) {
  const { container } = props
  ReactDOM.render(
    <App />,
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  )
}
console.log(window.__POWERED_BY_QIANKUN__, 'window.__POWERED_BY_QIANKUN__')
if (!window.__POWERED_BY_QIANKUN__) {
  render({})
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped')
}

export async function mount(props) {
  console.log('[react16] props from main framework', props)
  render(props)
}

export async function unmount(props) {
  const { container } = props
  ReactDOM.unmountComponentAtNode(
    container
      ? container.querySelector('#root')
      : document.querySelector('#root')
  )
}
