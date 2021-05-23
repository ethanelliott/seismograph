import Vue from 'vue'
import App from './app/app.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueApollo from "vue-apollo";
import {apolloProvider} from "./apollo/apollo-provider";
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false

Vue.use(VueApollo);

new Vue({
    router,
    store,
    vuetify,
    apolloProvider,
    render: h => h(App)
}).$mount('#app')
