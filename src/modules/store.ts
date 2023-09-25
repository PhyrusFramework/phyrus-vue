import PackageState from "./PackageState";

export default class StoreClass {
    
    private createStore() {
        const obj = {
            getters: {}
        }
        PackageState.set('store', obj);
        return obj;
    }

    public getter(key: string, loader?: () => Promise<any>) {

        let store : any = PackageState.get('store');
        if (!store) {
            store = this.createStore();
        }

        if (!store.getters[key]) {
            store.getters[key] = {
                value: undefined,
                loader,
                listeners: [],
                status: 'none'
            }
        }
        else {
            store.getters[key].loader = loader;

            if (store.getters[key].listeners.length > 0) {
                this.get(key);
            }
        }

    }

    public clear(key:string) {

        const store : any = PackageState.get('store');
        if (!store) return;

        if (store.getters[key]) {
            store.getters[key].value == undefined;
            store.getters[key].status = 'none';
        }
    }

    public reload(key: string) {
        this.clear(key);
        return this.get(key);
    }

    public set(key: string, value: any) {
        this.getter(key, () => new Promise(resolve => {
            resolve(value);
        }))
    }

    public getSync(key: string) {

        const store : any = PackageState.get('store');
        if (!store) return undefined;

        if (!store.getters[key]) {
            return undefined;
        }

        return store.getters[key].value;
    }

    public get(key:string, loader?: () => Promise<any>) {
        return new Promise((resolve, reject) => {

            let store : any = PackageState.get('store');
            if (!store) {
                store = this.createStore();
            }

            if (!store.getters[key]) {
                this.getter(key, loader);
            }
    
            const g = store.getters[key];

            if (g.value === undefined) {

                if ((g.status == 'none' && !g.loader) || g.status == 'loading') {
                    g.listeners.push(resolve);
                } else if (g.loader) {

                    g.status = 'loading';

                    g.loader()
                    .then((value: any) => {

                        g.status == 'loaded';
                        g.value = value;

                        g.listeners.push(resolve);
                        for(const r of g.listeners)
                            r(g.value);
                        g.listeners = [];

                    });

                }

            } else {

                g.listeners.push(resolve);

                for(const r of g.listeners)
                    r(g.value);
                
                g.listeners = [];

            }

        });
    }

}

const Store : StoreClass = new StoreClass();
export {
    Store
}