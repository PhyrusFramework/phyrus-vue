
export default class Store {

    private static _getters: any = {}

    public static getter(key: string, loader?: () => Promise<any>) {

        if (!this._getters[key]) {
            this._getters[key] = {
                value: undefined,
                loader,
                listeners: [],
                status: 'none'
            }
        }
        else {
            this._getters[key].loader = loader;

            if (this._getters[key].listeners.length > 0) {
                this.get(key);
            }
        }

    }

    public static clear(key:string) {
        if (this._getters[key]) {
            this._getters[key].value == undefined;
            this._getters[key].status = 'none';
        }
    }

    public static reload(key: string) {
        this.clear(key);
        return this.get(key);
    }

    public static set(key: string, value: any) {
        this.getter(key, () => new Promise(resolve => {
            resolve(value);
        }))
    }

    public static getSync(key: string) {
        if (!this._getters[key]) {
            return null;
        }

        const g = this._getters[key];

        if (g.value !== undefined) {
            return g.value;
        }
    }

    public static get(key:string, loader?: () => Promise<any>) {
        return new Promise((resolve, reject) => {

            if (!this._getters[key]) {
                this.getter(key, loader);
            }
    
            const g = this._getters[key];

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