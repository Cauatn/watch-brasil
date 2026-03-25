import { createApp } from 'vue'
import './style.css'
import 'vue-sonner/style.css'
import App from './App.vue'
import { registerPlugins } from '@/providers/register-plugins'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)

registerPlugins(app)

await useAuthStore().hydrate()

app.mount('#app')
