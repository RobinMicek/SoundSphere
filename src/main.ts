import { mount } from 'svelte'
import './css/app.css'
import App from './App.svelte'
import { registerSW } from 'virtual:pwa-register'

registerSW();

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
