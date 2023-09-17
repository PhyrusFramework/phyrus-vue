import Validator from "./validator";

export default {

    /**
     * Get query params from URL.
     * 
     * @return any
     */
    queryParams() : any {
        const queryParams = new URLSearchParams(window.location.search);

        // Convert the query parameters to an object
        const paramsObject: any = {};
        for (const [key, value] of queryParams) {
          paramsObject[key] = value;
        }
        return paramsObject;
    },

    /**
     * Update the current URL to include new parameters.
     * 
     * @param params 
     * @param keepCurrentParams 
     */
    setQueryParams(params: any, keepCurrentParams: boolean = false) {
        const queryParams = new URLSearchParams(keepCurrentParams ? window.location.search : undefined);

        // Update the query parameters with the provided params object
        for (const key in params) {
          queryParams.set(key, params[key]);
        }

        let count = 0;
        for (const v of queryParams.values()) {
          count++;
        }
      
        // Build the new URL with updated query parameters
        const newUrl = count == 0 ? 
            window.location.pathname :
            `${window.location.pathname}?${queryParams.toString()}`;
      
        // Update the browser history without refreshing the page
        history.pushState({}, '', newUrl);
    },

    /**
     * Get item from array using a dot notation
     * string.
     * 
     * @param array arr 
     * @param string key 
     * @returns {*} value
     */
    dotNotation(arr: any, key: string, defaultValue?: string|null) : any {
        if(!arr || !key) {
            return defaultValue !== undefined ? defaultValue : null;
        }

        if (!key.includes(".")) {
            if (arr[key]) return arr[key];
            return key;
        }
        const parts = key.split(".");
        let c = arr;
        for(let i = 0; i<parts.length - 1; ++i) {
            if (!c[parts[i]]) return defaultValue !== undefined  ? defaultValue : key;
            c = c[parts[i]];
        }
        const n = parts.length - 1;
        if (!c[parts[n]]) return defaultValue !== undefined  ? defaultValue : key;
        return c[parts[n]];
    },

    /**
     * Reverts an array
     * 
     * @param array arr 
     * @returns array
     */
    invertList(arr: Array<any>) {
        const inv = [];

        for(let i = arr.length - 1; i >= 0; --i) {
            inv.push(arr[i]);
        }

        return inv;
    },

    /**
     * Compare two objects recursively.
     * 
     * @param a
     * @param b 
     */
     areEqual(a: any, b: any) {

        if (!a) {
            if (!b) return true;
            return false;
        }
        if (!b) {
            if (!a) return true;
            return false;
        }

        if (Array.isArray(a)) {
            if (!Array.isArray(b)) return false;

            if (a.length != b.length) return false;

            for(let i = 0; i < a.length; ++i) {
                const ia = a[i];
                const ib = b[i];
                if (!this.areEqual(ia, ib)) return false;
            }
            return true;
        }

        if (typeof a == 'object') {
            if (typeof b != 'object') return false;

            const ka = Object.keys(a);
            const kb = Object.keys(b);
    
            if (ka.length != kb.length) return false;
    
            let equal = true;
            ka.forEach((k: string) => {
                if (!equal) return;

                const ia = a[k];
                const ib = b[k];
                equal = this.areEqual(ia, ib);
            });

            return equal;
        }

        return a == b;

    },

    /**
     * Generates a duplicate of an object
     * 
     * @param obj Object
     * @returns Object
     */
     copy(obj: any, options?: {
        copyArrays?: boolean,
        recursive?: boolean
     }, tree: any[] = []) {

        const arrays = options && options.copyArrays === false ? false : true;
        const recursive = options && options.recursive === false ? false : true;

        const s: any = {};
        if (!obj) return s;
        Object.keys(obj)
        .forEach((key: string) => {

            if (Array.isArray(obj[key])) {
                if (arrays)
                    s[key] = this.copyArray(obj[key]);
                else
                    s[key] = obj[key];
            }
            else if (typeof obj[key] == 'object') {

                if (recursive) {

                    if (obj[key].copy && typeof obj[key].copy == 'function') {
                        s[key] = obj[key].copy();
                    } else {
                        s[key] = this.copy(obj[key], options, tree);
                    }

                } else {
                    s[key] = obj[key];
                }
            } else {
                s[key] = obj[key];
            }
        });
        return s;
    },

    /**
     * Copy an array
     * 
     * @param arr 
     */
    copyArray(arr: any[], options?: {
        copyObjects: boolean,
        copyArrays: boolean
    }, tree: any[] = []) {
        const newarr : any[] = [];

        const arrays = options && options.copyArrays === false ? false : true;
        const objects = options && options.copyObjects === false ? false : true;

        for(const item of arr) {

            if (Array.isArray(item)) {
                newarr.push(
                    arrays ? 
                    this.copyArray(item, options, tree)
                    : item
                );
            }
            else if (typeof item == 'object') {

                if (!objects) {
                    newarr.push(item);
                } else {

                    if (item.copy && typeof item.copy == 'function') {
                        newarr.push(item.copy());
                    }
                    else {
                        newarr.push(this.copy(item, {
                            recursive: true,
                            copyArrays: arrays
                        }));
                    }

                }
            }
            else {
                newarr.push(item);
            }

        }

        return newarr;
    },

    /**
     * Validates email format
     * 
     * @param email 
     * @returns bool
     */
    validateEmail(email: string) {
        if (!email) return false;
        if (email == "") return false;
        if (email.length < 4) return false;

        const c1 = email.indexOf("@");
        const c2 = email.lastIndexOf(".");
        if (c1 < 0) return false;
        if (c2 < 0) return false;
        if (c2 < c1) return false;

        const parts1 = email.split('@');
        const parts2 = parts1[1].split('.');
        
        if (parts1[0] == '') return false;
        if (parts2[0] == '') return false;
        if (parts2[1] == '') return false;

        return true;
    },

    /**
     * Appends items to list
     * 
     * @param array list 
     * @param array items
     * 
     * @returns array
     */
    addToList(list: any[]|null|undefined, items: any[], mapFunc?: (item: any) => any) {
        let l = list;
        if (!l) l = items;
        else {
            for(const n of items) {
                if (mapFunc) {
                    l.push(mapFunc(n));
                } else {
                    l.push(n);
                }
            }
        }
        return l;
    },

    /**
     * Generate a random string
     * 
     * @param int length 
     * @returns 
     */
    randomString(length = 10) {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result;
    },

    /**
     * Generate a random number.
     * 
     * @param max 
     */
    rand(max: number = 100) {
        return Math.random() * max;
    },

    /**
     * Force an object to adapt the structure of another with default values.
     * 
     * @param obj 
     * @param defaultValues 
     * @returns object
     */
    force(obj: any, defaultValues: any) {

        const res : any = {};

        Object.keys(defaultValues).forEach((k: string) => {
            res[k] = obj[k] ? obj[k] : defaultValues[k];
        });

        return res;

    },

    /**
     * Merge two objects recursively.
     * 
     * @param objA 
     * @param objB 
     */
    merge(objA: any, objB: any, mergeArrays = false) {

        const aux : any = {};

        Object.keys(objA).forEach((key: string) => {

            if (Array.isArray(objA[key])) {

                if (objB[key] === undefined) {
                    aux[key] = objA[key];
                } else if (Array.isArray(objB[key]) && mergeArrays) {
                    const list : any[] = [];
                    for(const item of objA[key]) {
                        list.push(item);
                    } 
                    for(const item of objB[key]) {
                        if (!list.includes(item))
                            list.push(item);
                    }
                    aux[key] = list;
                } else {
                    aux[key] = objB[key];
                }

            } 
            else if (typeof objA[key] == 'object') {

                if (objB[key] === undefined) {
                    aux[key] = objA[key];
                } else if (typeof objB[key] == 'object') {
                    aux[key] = this.merge(objA[key], objB[key]);
                } else {
                    aux[key] = objB[key];
                }

            } 
            else {

                if (objB[key] !== undefined) {
                    aux[key] = objB[key];
                } else {
                    aux[key] = objA[key];
                }

            }

        });

        Object.keys(objB).forEach((key: string) => {

            if (aux[key] === undefined) {
                aux[key] = objB[key];
            }

        });

        return aux;

    },

    /**
     * Detect if the bottom has been reached.
     * 
     * @param e Scroll event
     */
    scrollBottomReached(e: any, threshold : number = 50) {

        const top = e.target.scrollTop;
        const height = e.target.clientHeight;
        const scrollHeight = e.target.scrollHeight;
        const umbral = threshold ? threshold : 50;

        if (top + height >= scrollHeight - umbral) {

            return true;

        }

        return false;

    },

    /**
     * Convert a file from an input in a src for an img tag.
     * 
     * @param file
     */
    fileToSrc(file: any) : Promise<any> {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();
        
            reader.onloadend = function () {
                resolve(reader.result);
            }

            reader.onerror = function() {
                reject();
            }
            
            reader.readAsDataURL(file);

        });
    
    },

    fetchFile(path: string, fileName: string = 'file') : Promise<File> {
        return new Promise((resolve, reject) => {
            fetch(path)
            .then(r => r.blob())
            .then((blob: Blob) => {

                const format = blob.type;
                const mimes = this.getMIMETypes();

                let extension = '.txt';
                const keys = Object.keys(mimes);
                for(const k of keys) {
                    if (mimes[k] == format) {
                        extension = '.' + k;
                        break;
                    }
                }

                const file = new File([blob], fileName + extension);
                resolve(file);
            })
            .catch(reject);
        })
    },


    fileToURL(file: File) {
        return URL.createObjectURL(file);
    },

    /**
     * 
     * Convert base64 image to blob/file to be uploaded.
     * 
     * @param src Base 64
     * @returns file
     */
    base64ToFile(src: string, name: string = 'file') {
        // convert base64/URLEncoded data component to raw binary data held in a string
        let byteString;
        const split = src.split(',');
        if (split[0].indexOf('base64') >= 0)
            byteString = window.atob(split[1]);
        else
            byteString = unescape(split[1]);
        // separate out the mime component
        const mimeString = split[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ia], {type:mimeString});

        let n = name + '';
        if (n == 'file') {
            if (['image/png'].includes(mimeString)) {
                n += '.png';
            }
            else if (['image/jpg', 'image/jpeg'].includes(mimeString)) {
                n += '.jpg';
            }
            else if (['image/gif'].includes(mimeString)) {
                n += '.gif';
            }
            else if (['video/mp4'].includes(mimeString)) {
                n += '.mp4';
            }
            else if (['application/pdf'].includes(mimeString)) {
                n += '.pdf';
            }
            else if (['text/plain'].includes(mimeString)) {
                n += '.txt';
            }
        }

        return new File([blob], n, {type:mimeString});
    },

    /**
     * Convert the first letter to uppercase
     * 
     * @param text 
     * @returns string
     */
    capitalize(text: string) {
        return text[0].toUpperCase() + text.substr(1);
    },

    /**
     * Generate a URL to a random image
     * 
     * @param width 
     * @param height 
     * @returns URL
     */
    randomImage(width = 250, height = 250, seed?: string) {
        return 'https://picsum.photos/seed/' + (seed ? seed : this.randomString(4)) + '/' + width + '/' + height;
    },
    
    /**
     * Check if filename has any of these extensions
     * 
     * @param filename 
     * @param extensions 
     * @returns boolean
     */
    hasExtension(filename: string|File, extensions: string|string[]) : boolean {

        const name : string = typeof filename == 'string' ? filename : filename.name;

        const list = Array.isArray(extensions) ? extensions : [extensions];

        for(const s of list) {
            if (name.includes('.' + s)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Format number as text
     * 
     * @param num 
     * @returns 
     */
    formatNumber(num: any, decimals: number = 2) : string {
        if (!num) return '0';

        let n = num;
        if (typeof n == 'number') {
            if (decimals > 0) {
                n = n.toFixed(decimals);
            } else {
                n = "" + Math.floor(n);
            }
        }
        n = n.replace('.', ',');

        if (n.includes(',')) {
            return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }

        const parts = n.split(',');
        const ent = parts[0];
        const dec = parts[1];

        return ent.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ',' + dec;
    },

    /**
     * Get object of {extension: mime}
     * 
     * @returns 
     */
    getMIMETypes() : any {
        return {
          'txt' : 'text/plain',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'doc' : 'application/msword',
          'pdf' : 'application/pdf',
          'jpg' : 'image/jpeg',
          'jpeg': 'image/jpeg',
          'bmp' : 'image/bmp',
          'png' : 'image/png',
          'gif' : 'image/gif',
          'xls' : 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'rtf' : 'application/rtf',
          'ppt' : 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'zip' : 'application/zip',
          'mp3' : 'audio/mp3',
          'mpeg': 'video/mpeg',
          'mp4' : 'video/mp4'
        }
    },

    /**
     * Get mime of extension
     * @param extension 
     * @returns 
     */
    getMimeType(extensionOrFile: string|File) : string {

        let name = '';
        if (typeof extensionOrFile != 'string') {
            name = extensionOrFile.name;
        } else {
            if (!extensionOrFile.includes('.'))
                name = extensionOrFile;
            else {
                const parts = extensionOrFile.split('.');
                name = parts[parts.length - 1];
            }
        }

        const types = this.getMIMETypes();
        if (types[name]) {
            return types[name];
        }
        return 'text/plain';
    },

    /**
     * Check whether this file is an image.
     * 
     * @param file
     * @returns 
     */
    isImage(file: File) : boolean {
        const mime = this.getMimeType(file);
        return mime.includes('image/');
    },

    /**
     * Convert HTML text to plain text
     * 
     * @param htmlText 
     * @returns string
     */
    stripTags(htmlText: string) : string {
        const e = document.createElement('div');
        e.innerHTML = htmlText;
        return e.textContent ? e.textContent : '';
    },

    /**
     * Download file
     * 
     * @param file
     */
    downloadFile(file: File) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = file.name;
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.remove();
        }, 0)
    },

    /**
     * Download blob
     * 
     * @param blob 
     * @param name 
     */
    downloadBlob(blob: Blob, name: string) {
        this.downloadFile(new File([blob], name));
    },

    /**
     * Copy text to clipboard
     * 
     * @param text 
     */
    clipboard(text: string) {
        return new Promise((resolve, reject) => {

            if (typeof navigator !== "undefined" 
            && typeof navigator.clipboard !== "undefined" 
            && navigator.permissions) {

                const type = "text/plain";
                const blob = new Blob([text], { type });
                const data = [new ClipboardItem({ [type]: blob })];

                navigator.permissions.query({name: "clipboard-write" as PermissionName}).then((permission) => {

                    if (permission.state === "granted" || permission.state === "prompt") {
                        navigator.clipboard.write(data).then(resolve, reject).catch(reject);
                    }
                    else {
                        reject(new Error("Permission not granted!"));
                    }
                });
            }
            else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                const textarea = document.createElement("textarea");
                textarea.textContent = text;
                textarea.style.position = "fixed";
                textarea.style.width = '2em';
                textarea.style.height = '2em';
                textarea.style.padding = '0px';
                textarea.style.border = 'none';
                textarea.style.outline = 'none';
                textarea.style.boxShadow = 'none';
                textarea.style.background = 'transparent';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                try {
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    resolve(true);
                }
                catch (e) {
                    document.body.removeChild(textarea);
                    reject(e);
                }
            }
            else {
                reject(new Error("None of copying methods are supported by this browser!"));
            }
        });
    },

    /**
     * Download text as a file
     * 
     * @param text 
     * @param filename 
     */
    downloadText(text: string, filename: string) {
        // Create a Blob object from the text
        const blob = new Blob([text], { type: 'text/plain' });
      
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
      
        // Create a link element with the URL as href and download attribute
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
      
        // Append the link to the document body and click it programmatically
        document.body.appendChild(link);
        link.click();
      
        // Remove the link from the document body
        document.body.removeChild(link);
      
        // Release the URL object
        URL.revokeObjectURL(url);
    },

    /**
     * Separate words in a string
     * 
     * @param text 
     * @returns 
     */
    separateWords(text: string) : string[] {
        const words: string[] = [];

        let currentWord: string = '';

        for(let i = 0; i < text.length; ++i) {
            const c = text[i];

            if (
                // if not . or ,
                !Validator.for(c)
                .isSpecialChars()
                .validate()

                // And
                && (
                    
                    // It's a letter
                    Validator.for(c)
                    .isLetters().validate()
                    ||
                    // Or a number
                    Validator.for(c)
                        .isNumber().validate()
                    
                )
            ) {
                currentWord += c;
            } else {

                if (currentWord != '') {
                    words.push(currentWord);
                }

                currentWord = '';
            }
        }

        return words;
    },

    /**
     * Change CSS variable programmatically.
     * 
     * @param name 
     * @param value
     */
    cssVariable(name: string, value: string) {
        if (!document) return;
        const root = document.querySelector(':root');
        if (!root) return;
        (root as any).style.setProperty('--' + name, value);
    }

}