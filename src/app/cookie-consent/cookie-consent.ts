import { defineComponent } from 'vue';
import translate from '../../modules/translator';
import Storage from '../../modules/storage';
import App from '../../modules/app';
import CookieDialog from './cookie-dialog/cookie-dialog.vue';
import Config from '../../modules/config';

export type CookieConsentInterface = {
    _ref: any,
    _pendingTypes: CookieType[],
    setReference: (ref: any) => void,
    addType: (type: CookieType) => void
}

export type CookieType = {
    id: string,
    name: string,
    description: string,
    accepted?: boolean
}

export default defineComponent({

    data() {
        const data : {
            cookiesAnswered: boolean,
            types: CookieType[]
        } = {
            cookiesAnswered: false,
            types: []
        };

        return data;
    },

    created() {
        const use : any = Config.get('cookieConsent');
        this.cookiesAnswered = !use || !(!Storage.get('cookie-consent'));
    },

    methods: {
        $t(key: string) {
            return translate.get(key);
        },

        save(cookies: any) {
            this.cookiesAnswered = true;
            Storage.set('cookie-consent', cookies);
        },

        collect(accept: boolean) {
            const cookies : any = {
                required: accept
            }

            for(const t of this.types) {
                cookies[t.id] = accept;
            }

            return cookies;
        },

        accept() {
            this.save(this.collect(true));
        },

        reject() {
            this.save(this.collect(false));
        },

        addType(type: CookieType) {
            const t : any = type;
            t['accepted'] = t.accepted ? true : false;

            this.types.push(t);
        },

        configure() {
            App.modal.open({
                component: CookieDialog,
                class: 'cookie-configuration',
                props: {
                    types: this.types,
                    onClose: (cookies: any) => {
                        this.save(cookies);
                    }
                }
            })
        }
    }

})