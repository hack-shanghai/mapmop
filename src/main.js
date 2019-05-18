import Vue from 'vue'
import App from './App.vue'
import store from './store';
import router from './router';

Vue.config.productionTip = false

require('bulma/css/bulma.min.css');

/**
 * Set MomentJS.
 */
import moment from 'moment'

const locale = document.documentElement.lang;
moment.locale(locale);

/**
 * Set i18n.
 */
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

import translations from './i18n'

const i18n = new VueI18n({
  locale: locale, // set locale
  fallbackLocale: 'en', // set fallback
  messages: translations // set locale messages
});

/**
 * Notifications
 */
import VueAWN from "vue-awesome-notifications";
require('vue-awesome-notifications/dist/styles/style.css');

const awnOptions = {
  labels: {
    confirm: '',
  },
};
Vue.use(VueAWN, awnOptions);

/**
 * Validations
 */
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, { validity: true });

/**
 * Axios
 */
import axios from 'axios';
axios.defaults.baseURL = '/api/';

/**
 * Components
 */

/**
 * Load the Vue App.
 */
new Vue({
  render: h => h(App),
  router,
  store,
  i18n,
}).$mount('#app')
