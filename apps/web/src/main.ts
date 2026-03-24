import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerPlugins } from '@/core/providers/register-plugins'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)

registerPlugins(app)

await useAuthStore().hydrate()

app.mount('#app')
