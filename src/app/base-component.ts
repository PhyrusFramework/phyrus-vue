import { ComponentOptions } from 'vue';
import translate from '../modules/translator';
import Utils, { UtilsType } from '../modules/utils';
import StorageClass, { Storage } from '../modules/storage';
import Config from '../modules/config';
import utils from '../modules/utils';
import StoreClass, { Store } from '../modules/store';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $config: any,
        $store: StoreClass,
        $storage: StorageClass,
        $utils: UtilsType,
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

export default (App: any) => {

    const cmp : ComponentOptions = {
        data() {
            return {
                _updateCheck: 1
            }
        },
    
        mounted() {
            if (import.meta.hot) {
                // Accept hot updates for this component
                import.meta.hot.accept();
                
                // Optional: React to updates, for example, by re-executing the created() method
                import.meta.hot.on("update", () => {
                  this.created();
                });
            }
        },
    
        computed: {
            $config() {
                return Config.values();
            },
            $store() : StoreClass {
                return Store;
            },
            $utils() : UtilsType {
                return Utils;
            },
            $storage() : StorageClass {
                return Storage;
            },
            $lang() : any {
                return translate;
            }
        },
    
        methods: {
    
            forceUpdate() {
                this._updateCheck += 1;
            },
    
            $t(key: string, params?: any) : string {
                return translate.get(key, params);
            },
            hasEvent(name: string) : boolean {
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
            },
    
            hasSlot(name: string) : boolean {
                return !!this.$slots[name];
            }
        }
    }
    return cmp;
}