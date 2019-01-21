module.exports = function entryScript(page) {
    return `
const Vue = typeof window == 'undefined' ? require('vue').default : require('@src/vue').default;
import App from '@src/pages/${page}/index.vue';

Vue.AppReady && Vue.AppReady(() => createApp().$mount('#app'))

export default function createApp() {
    return new Vue({
        render: h => h(App),
    })
};
    `;
};
