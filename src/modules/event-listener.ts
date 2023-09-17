
export default class EventListener {

    static events : any = {}

    static waiters : any = {}

    static on(event: string, action: string, callback: (param?: any) => void) {

        if (!this.events[event]) {
            this.events[event] = {}
        }

        let ac = action;
        if (ac == '*') {
            ac = "" + Math.random() * 1000;
            while(this.events[event][ac]) {
                ac = "" + Math.random() * 1000;
            }
        }

        this.events[event][ac] = callback;

        if (this.waiters[event]) {
            for(const waiter of this.waiters[event]) {
                callback(waiter);
            }
            this.waiters[event] = null;
            delete this.waiters[event];
        }

    }

    static trigger(event: string, param?: any) : Promise<any[]> {

        return new Promise((resolve, reject) => {

            if (!this.events[event]) {

                if (!this.waiters[event]) {
                    this.waiters[event] = [];
                }
    
                this.waiters[event].push(param);
                resolve([]);
                return;
            }
    
            this._trigger(event, Object.keys(this.events[event]), param)
            .then((returns: any) => {
                resolve(returns);
            });

        });

    }

    private static _trigger(event: string, keys: string[], param: any, returns: any[] = []) : Promise<any[]> {
        
        return new Promise((resolve, reject) => {

            if (keys.length == 0) {
                resolve(returns);
                return;
            }

            const key = keys[0];

            const func = this.events[event][key];
            if (!func) {
                resolve(returns);
                return;
            }

            const ret = func(param);

            const recursive = () => {
                keys.splice(0, 1);
                this._trigger(event, keys, param, returns)
                .then(returns => {
                    resolve(returns);
                });
            };

            if (ret instanceof Promise) {
                ret.then(res => {
                    returns.push(res);
                    recursive();
                });
            }
            else {
                returns.push(ret);
                recursive();
            }

        });
    }

    static resetEvent(event: string) {
        this.events[event] = null;
        delete this.events[event];
        if (this.waiters[event]) {
            this.waiters[event] = null;
            delete this.waiters[event];
        }
    }

    static destroy(event: string, action: string) {
        if (!this.events[event]) return;
        if (!this.events[event][action]) return;
        this.events[event][action] = null;
        delete this.events[event][action];
    }

    static existsEvent(event: string) {
        if (!this.events[event]) return false;
        return true;
    }

}