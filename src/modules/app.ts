import { createRouter, createWebHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';
import Alert from '../modals/alert/alert.vue';
import { AppModalInterface, ModalOptions, ModalType } from '../app/app-modal/app-modal';
import { AppNotification, AppNotificationsInterface } from '../app/app-notifications/app-notifications';
import { DrawerInterface, DrawerOptions } from '../app/drawer/drawer';
import translate from './translator';
import Cropper from '../modals/cropper/cropper.vue';
import ScreenLoader from '../modals/screen-loader/screen-loader.vue';
import { CookieConsentInterface, CookieType } from '../app/cookie-consent/cookie-consent';
import AppPage from '../app/app-page/app-page.vue';
import IAppConfig from '../interfaces/IAppConfig';
import Config from './config';
import Container from '../widgets/grid/cntainer.vue';
import Row from '../widgets/grid/row.vue';
import Cul from '../widgets/grid/cul.vue';
import SvgIcon from '../widgets/svg-icon/svg-icon.vue';
import Btn from '../widgets/btn/btn.vue';
import CloseX from '../widgets/closex/closex.vue';
import Loader from '../widgets/loader/loader.vue';
import http from './http';
import IButton from '../interfaces/IButton';
import baseComponent from '../app/base-component';
import { markRaw } from 'vue';

export default class App {

    static init(app: any, config: IAppConfig) {

        Config.init(config);
        http.loadTokenFromStorage();

        const router = createRouter({
            history: createWebHistory(),
            routes: config.routes,
        });
        app.use(router);

        app.use(PrimeVue, config.primevue);
        app.mixin(baseComponent);

        // Register global components
        app.component('app-page', AppPage);
        app.component('container', Container);
        app.component('Container', Container);
        app.component('row', Row);
        app.component('cul', Cul);
        app.component('Row', Row);
        app.component('Cul', Cul);
        app.component('svg-icon', SvgIcon);
        app.component('btn', Btn);
        app.component('close-x', CloseX);
        app.component('loader', Loader);
        app.component('SvgIcon', SvgIcon);
        app.component('Btn', Btn);
        app.component('CloseX', CloseX);
        app.component('Loader', Loader);

        // Directives
        app.directive('ripple', Ripple);
        app.directive('bgimage',{

            mounted(el: HTMLElement, binding: any) {
                el.style.backgroundPosition = 'center';
                el.style.backgroundSize = 'cover';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.backgroundColor = 'gray';
                el.style.backgroundImage = `url('${binding.value}')`;
            },
            updated(el: HTMLElement, binding: any) {
                el.style.backgroundPosition = 'center';
                el.style.backgroundSize = 'cover';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.backgroundColor = 'gray';
                el.style.backgroundImage = `url('${binding.value}')`;
            },
        });

        return app;
    }

    static drawer : DrawerInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },

        setTitle(title: string) {
            if (!this._ref) return App.drawer;

            this._ref.title = title;
            return App.drawer;
        },

        setButtons(buttons: IButton[]) {
            if (!this._ref) return App.drawer;

            this._ref.buttons = buttons
            return App.drawer;
        },

        onClose(func: () => any) {
            if (!this._ref) return App.drawer;

            this._ref.onClose = func;
            return App.drawer;
        },

        open(options: DrawerOptions) {
            if (!this._ref) return;

            this._ref.open(options);
            return App.drawer;
        },

        close() {
            if (!this._ref) {
                return new Promise((resolve,reject) => {});
            }

            return this._ref.close();
        }

    };

    static notification(text: string = '') {

        const notifications = this.notifications;

        const builder : AppNotification = {
            type: 'success',
            text: text,
            component: undefined,
            props: {},
            time: 2000,
            closable: true,
            className: '',
            setType(type: 'success'|'info'|'warn'|'error') {
                this.type = type;
                return this;
            },
            notClosable() {
                this.closable = false;
                return this;
            },
            setTime(time: number) {
                this.time = time;
                return this;
            },
            setText(text: string) {
                this.text = text;
                return this;
            },
            setComponent(component: any, props: any = {}) {
                this.component = markRaw(component);
                this.props = props;
                return this;
            },
            class(className: string) {
                this.className = className;
                return this;
            },
            show() {
                if (!notifications._ref) return;
                notifications._ref.add(this);
            }
        }

        return builder;
    }

    static notifications : AppNotificationsInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },

        closeNotification(notification: any) {
            if (!this._ref) return;

            this._ref.closeNotification(notification);
        },

        closeLast() {
            if (!this._ref) return;

            this._ref.closeLast();
        },
        closeFirst() {
            if (!this._ref) return;

            this._ref.closeFirst();
        }

    }

    static modal : AppModalInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;
        },
    
        open(options: ModalOptions) {
            if (!this._ref) {
                return;
            }

            this._ref.open(options);
        },

        get current() : ModalType|null {
            if (!this._ref) return null;
            if (this._ref.modals.length == 0) return null;
            return this._ref.modals[this._ref.modals.length - 1];
        },
    
        close() {
            if (!this._ref) {
                return new Promise((resolve, reject) => {});
            }

            return this._ref.close();
        },

        setTitle(title: string) {
            if (!this._ref) {
                return
            }
            this._ref.setTitle(title);
        },

        noCloseX() {
            if (!this._ref) {
                return
            }
            this._ref.noCloseX();
        },

        noBackground() {
            if (!this._ref) {
                return
            }
            this._ref.noBackground();
        },

        draggable() {
            if (!this._ref) {
                return
            }
            this._ref.draggable();
        },

        maximizable() {
            if (!this._ref) {
                return
            }
            this._ref.maximizable();
        },

        cancelable() {
            if (!this._ref) {
                return
            }
            this._ref.cancelable();
        },

        noPadding() {
            if (!this._ref) {
                return
            }
            this._ref.noPadding();
        },

        setButtons(buttons: IButton[]) {
            if (!this._ref) {
                return
            }
            this._ref.setButtons(buttons);
        },

        onClose(callback: () => void) {
            if (!this._ref) {
                return
            }
            this._ref.onClose(callback);
        },

        onMaximize(callback: (open: boolean) => void) {
            if (!this._ref) {
                return
            }
            this._ref.onMaximize(callback);
        }

    }

    static alert(text: string) {
        
        App.modal.open({
            html: text,
            class: 'alert-modal'
        })

    }

    static confirm(text: string, options?: {
        icon?: string|null,
        yes?: string,
        no?: string
    }) : Promise<any> {

        return new Promise((resolve, reject) => {

            App.modal.open({
                html: text,
                closex: false,
                class: 'confirm-modal',
                buttons: [
                    {
                        content: options && options.no ? options.no : translate.get('generic.no'),
                        onClick: () => {
                            App.modal.close();
                            resolve(false);
                        }
                    },
                    {
                        content: options && options.yes ? options.yes : translate.get('generic.yes'),
                        onClick: () => {
                            App.modal.close();
                            resolve(true);
                        } 
                    }
                ]
            })

        });

    }

    /*
    TODO
    static cropImage(url: string, ratio: number = 0) : Promise<string> {
        
        return new Promise((resolve, reject) => {

            const props: any = {
                src: url,
                onSave: (src: string) => {
                    resolve(src);
                }
            }

            if (ratio > 0) {
                props['ratio'] = ratio;
            }

            this.modal.open({
                component: Cropper,
                class: 'cropper-modal',
                props: props
            });


        });

    }

    static loading() {
        this.modal.open({
            component: ScreenLoader,
            class: 'fullscreen-loader-modal',
            props: {
                color: 'white'
            }
        });
    }

    static stopLoading() {
        this.modal.close();
    }*/

    static cookieConsent : CookieConsentInterface = {

        _ref: null,
        setReference(ref: any) {
            this._ref = ref;

            for(const t of this._pendingTypes) {
                ref.addType(t);
            }
            this._pendingTypes = [];
        },

        _pendingTypes: [],

        addType(type: CookieType) {
            if (!this._ref) {
                this._pendingTypes.push(type);
                return;
            }
            this._ref.addType(type);
        }

    }

}