import './assets/main.css';

import { createApp, watch } from 'vue';
import { createPinia } from 'pinia';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

const app = createApp(App);
const pinia = createPinia();

watch(pinia.state, (state) => {
  localStorage.setItem('room', JSON.stringify(state.room));
  localStorage.setItem('user', JSON.stringify(state.user));
}, { deep: true });

app.use(vuetify);
app.use(pinia);
app.use(router);

app.mount('#app');