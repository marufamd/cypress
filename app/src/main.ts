import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { plugin, defaultConfig } from '@formkit/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue';
import router from '@/util/router';

const app = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);
app.use(plugin, defaultConfig);

app.mount('#app');
