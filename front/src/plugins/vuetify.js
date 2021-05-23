import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'


Vue.use(Vuetify);

export default new Vuetify({
    treeShake: true,
    theme: {
        themes: {
            options: {
                customProperties: true,
            },
            light: {
                primary: colors.green,
                body: '#fefefe'
            },
            dark: {
                primary: colors.green
            }
        }
    }
});
