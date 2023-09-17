import { getCurrentInstance, ComponentOptions } from 'vue';
import { useRouter, useRoute, Router } from 'vue-router'
import translate from '../modules/translator';
import Utils from '../modules/utils';
import Time from '../modules/time';
import Storage from '../modules/storage';
import Config from '../modules/config';
import App from '../modules/app';
import store from '../modules/store';
import utils from '../modules/utils';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        page: any,
        $t: (key: string, params?: any) => void,
        hasEvent: (name: string) => boolean,
        to: (page: string) => void,
        back: () => void,
        ref: (name: string) => any,
        closeModal: () => void,
        closeDrawer: () => void,
        forceUpdate: () => void
    }
}

const BaseComponent : ComponentOptions = {

    props: {
        Page: {}
    },

    data() {
        return {
            _updateCheck: 1
        }
    },

    methods: {

        forceUpdate() {
            this._updateCheck += 1;
        },

        $t(key: string, params?: any) {
            return translate.get(key, params);
        },
        hasEvent(name: string) {
            return this.$attrs && !(!this.$attrs['on' + utils.capitalize(name)]);
        },

        to(page: string) {
            this.$router.push(page);
        },

        back() {
            this.$router.back();
        },

        ref(name: string) : any {
            return this.$refs[name] as any;
        },

        closeModal() {
            return App.modal.close();
        },

        closeDrawer() {
            return App.drawer.close();
        }
    }
}
export default BaseComponent;