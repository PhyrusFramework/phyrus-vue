import utils from "./utils";

export default class Model {

    API(child: any, api?: any, exceptions?: {[key:string]: (v?:any) => any}) {
        if (!api) return;

        const exc = utils.copy(exceptions);
        const props : any = Object.getOwnPropertyNames(child)

        Object.keys(api)
        .forEach((k: string) => {

            if (!props.includes(k)) {
                delete props[k];
                return;
            }
            delete props[k];

            if (exc && exc[k]) {
                child[k] = exc[k](api[k]);
                delete exc[k];
                return;
            }

            child[k] = api[k];
        })

        Object.keys(exc)
        .forEach((k: string) => {

            if (!props.includes(k)) {
                delete props[k];
                return;
            }
            delete props[k];

            child[k] = exc[k]();

        })

    }

    makeCopy(newOne: any, child: any, exceptions: {[key:string]: (v?:any) => any} = {}) {
        const propsA : any = Object.getOwnPropertyNames(newOne);
        const propsB : any = Object.getOwnPropertyNames(child);
        const exc = Object.keys(exceptions);

        for(const p of propsA) {
            if (!propsB.includes(p)) {
                continue;
            }

            if (exc.includes(p)) {
                newOne[p] = exceptions[p](child[p]);
            } else {
                newOne[p] = child[p];
            }

            delete propsB[p];
            delete exc[p];
        }
    }

    export(child: any, exceptions: {[key:string]: (v?:any) => any} = {}) {

        const data : any = utils.copy(exceptions);
        const obj : any = {}

        const props = Object.getOwnPropertyNames(child)
        props.forEach((k: string) => {

            let val : any = child[k];

            if (data && data[k]) {
                val = exceptions[k](child[k]);
            }

            if (val === undefined) return;
            obj[k] = val;

            delete data[k];
        });

        Object.keys(data)
        .forEach((k: string) => {
            obj[k] = data[k]();
        });

        return obj;
    }

}