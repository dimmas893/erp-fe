import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Set document title from env
if (import.meta.env.VITE_APP_TITLE) {
  document.title = import.meta.env.VITE_APP_TITLE
}

// Set favicon from env
if (import.meta.env.VITE_APP_FAVICON) {
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = import.meta.env.VITE_APP_FAVICON
}

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
