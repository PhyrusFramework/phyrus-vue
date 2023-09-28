import { createRouter, createWebHistory } from 'vue-router';
import PrimeVue from 'primevue/config';
import Ripple from 'primevue/ripple';
import { AppModalInterface, ModalOptions, ModalType } from '../app/app-modal/app-modal';
import { AppNotification, AppNotificationsInterface } from '../app/app-notifications/app-notifications';
import { DrawerInterface, DrawerOptions } from '../app/drawer/drawer';
import { CookieConsentInterface, CookieType } from '../app/cookie-consent/cookie-consent';
import translate from './translator';
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
import IRoutes from '../interfaces/IRoutes';
import PackageState from './PackageState';
import { Storage } from './storage';
import ScreenLoader from '../modals/screen-loader/screen-loader.vue';

class AppClass {

    init(app: any, config: IAppConfig, routes: IRoutes) {

        Config.init(config, routes.layouts);
        http.loadTokenFromStorage();

        const router = createRouter({
            history: createWebHistory(),
            routes: routes.routes,
        });
        app.use(router);

        app.use(PrimeVue, config.primevue);
        app.mixin(baseComponent(this));

        // Register global components
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

    drawer : DrawerInterface = {

        setTitle(title: string) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.drawer) return this;

            ref.drawer.title = title;
            return this;
        },

        setButtons(buttons: IButton[]) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.drawer) return this;

            ref.drawer.buttons = buttons
            return this;
        },

        onClose(func: () => any) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.drawer) return this;

            ref.drawer.onClose = func;
            return this;
        },

        open(options: DrawerOptions) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.drawer) return this;

            ref.drawer.open(options);
            return this;
        },

        close() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.drawer) {
                return new Promise((resolve,reject) => {});
            }

            return ref.drawer.close();
        }

    };

    notification(text: string = '') {

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
                const ref = PackageState.get('globalWidgets');
                if (!ref || !ref.notifications) return;

                ref.notifications.add(this);
            }
        }

        return builder;
    }

    notifications : AppNotificationsInterface = {

        closeNotification(notification: any) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.notifications) return;

            ref.notifications.closeNotification(notification);
        },

        closeLast() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.notifications) return;

            ref.notifications.closeLast();
        },
        closeFirst() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.notifications) return;

            ref.notifications.closeFirst();
        }

    }

    modal : AppModalInterface = {

        open(options: ModalOptions) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.open(options);
        },

        get current() : ModalType|null {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return null;

            if (ref.modal.modals.length == 0) return null;
            return ref.modal.modals[ref.modal.modals.length - 1];
        },
    
        close() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) {
                return new Promise((resolve, reject) => {});
            }

            return ref.modal.close();
        },

        setTitle(title: string) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.setTitle(title);
        },

        noCloseX() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.noCloseX();
        },

        noBackground() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.noBackground();
        },

        draggable() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.draggable();
        },

        maximizable() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.maximizable();
        },

        cancelable() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.cancelable();
        },

        noPadding() {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.noPadding();
        },

        setButtons(buttons: IButton[]) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.setButtons(buttons);
        },

        onClose(callback: () => void) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.onClose(callback);
        },

        onMaximize(callback: (open: boolean) => void) {
            const ref = PackageState.get('globalWidgets');
            if (!ref || !ref.modal) return;

            ref.modal.onMaximize(callback);
        }

    }

    alert(text: string) {
        
        this.modal.open({
            html: text,
            class: 'alert-modal'
        })

    }

    confirm(text: string, options?: {
        icon?: string|null,
        yes?: string,
        no?: string
    }) : Promise<any> {

        return new Promise((resolve, reject) => {

            this.modal.open({
                html: text,
                closex: false,
                class: 'confirm-modal',
                buttons: [
                    {
                        content: options && options.no ? options.no : translate.get('generic.no'),
                        onClick: () => {
                            this.modal.close();
                            resolve(false);
                        }
                    },
                    {
                        content: options && options.yes ? options.yes : translate.get('generic.yes'),
                        onClick: () => {
                            this.modal.close();
                            resolve(true);
                        } 
                    }
                ]
            })

        });

    }

    loaderComponent = ScreenLoader;
    loading() {
        this.modal.open({
            component: this.loaderComponent,
            class: 'fullscreen-loader-modal',
            closex: false,
            props: {
                color: 'white'
            }
        });
    }

    stopLoading() {
        this.modal.close();
    }
    cookieConsent : CookieConsentInterface = {

        addType(type: CookieType) {
            const ref = PackageState.get('globalWidgets');

            if (!ref.cookieConsent) {
                if (!ref.cookiePendingTypes) {
                    ref['cookiePendingTypes'] = [];
                }
                ref.cookiePendingTypes.push(type);
            } else {
                ref.cookieConsent.addType(type);
            }
        },

        getPreferences() {
            const prefs = Storage.get('cookie-consent');
            if (!prefs) {
                return {accepted: false}
            }

            prefs['accepted'] = true;
            return prefs;
        }

    }

}

const App = new AppClass();
export default App;