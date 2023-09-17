import axios from 'axios';
import Storage from './storage';

export type HTTPMethod = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';

export type HTTPDataFormat = 'json'|'formData'|'urlencoded'|'plain'|'html'|'xml';

export type HTTPResponseType = 'json'|'blob'|'text';

export type Request = {
    method: HTTPMethod,
    url: string,
    baseUrl?: string,
    data: any,
    headers: any,
    dataFormat: HTTPDataFormat
    isRefresh: boolean,
    fakeRequestAction: ((request: Request) => Promise<any>)|null,
    responseType: HTTPResponseType,
    fullResponse: boolean,
    refreshConsumed: boolean,
    promiseCallbacks?: {
        resolve: Function,
        reject: Function
    },

    setMethod: (method: HTTPMethod) => Request,
    set: (data: any) => Request,
    setUrl: (url: string, parameters?: any) => Request,
    setBaseURL: (base: string) => Request,
    setHeaders: (headers: any) => Request,
    setDataFormat: (format: HTTPDataFormat) => Request,
    setResponseType: (type: HTTPResponseType) => Request,
    //send: () => Promise<any>,
    fakeResponse: (action: (request: Request) => Promise<any>) => Request,
    getFullResponse: () => Request,
    then: (response: any) => Promise<any>
}

type RequestAttempt = {
    method: HTTPMethod,
    url: string,
    data: any,
    headers: any,
    dataFormat: HTTPDataFormat
    responseType: HTTPResponseType,
    fullResponse: boolean
}

export type HTTPError = {
    status: number,
    data: any,
    url: string,
    method: string,
    headers: any
}

type RequestInterceptor = () => Promise<void>
type ResponseInterceptor = () => Promise<any>

const arrayToFormData = (form: FormData, name: string, arr: any[]) => {
    for(let i = 0; i < arr.length; ++i) {
        const obj = arr[i];
        if (typeof obj == 'object' && !(obj instanceof File)) {
            Object.keys(obj)
            .forEach((key: string) => {
                form.append(name + '[' + i + '].' + key, obj[key]);
            });
        } else {
            if (!(obj instanceof File))
                form.append(name + '[' + i + ']', obj);
            else
                form.append(name, obj);
        }
    }
}

export default class http {

    // Internal attributes
    public static baseURL : string = '';
    private static nextRequestIsRefresh: boolean = false
    private static token: string = '';
    private static refreshToken: string = '';
    private static refreshingToken: boolean = false;
    private static globalHeadersAction: (request: Request) => Promise<any> 
        = () => new Promise(resolve => resolve({}))
    private static pendingRequests: Request[] = []
    private static mappedEndpoints: any = {}
    private static requestInterceptors: RequestInterceptor[] = [];
    private static responseInterceptors: ResponseInterceptor[] = [];

    // Getters and Setters
    public static getToken() : string { return this.token; }
    public static getRefreshToken() : string { return this.refreshToken; }
    public static removeToken() {
        this.token = '';
        this.refreshToken = '';
        Storage.remove('token');
        Storage.remove('refreshToken');
    }
    public static setToken(token: string, refreshToken?: string) { 
        this.token = token;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
    public static loadTokenFromStorage() {
        const tk = Storage.get('token');
        const rtk = Storage.get('refreshToken');
        if (tk) {
            this.setToken(tk, rtk);
        }
    }
    public static setTokenInStorage(token: string, refreshToken?: string) { 
        this.setToken(token, refreshToken);
        Storage.set('token', token);
        Storage.set('refreshToken', refreshToken);
    }

    public static setGlobalHeaders(action: (request: Request) => Promise<any>) {
        this.globalHeadersAction = action;
    }

    public static registerEndpoints(nameOrList: any, url?: string) {
        if (typeof(nameOrList) == 'string') {
            this.mappedEndpoints[nameOrList] = url;
            return;
        }

        Object.keys(nameOrList)
        .forEach((name: string) => {
            const url = nameOrList[name];

            this.mappedEndpoints[name] = url;
        });
    }

    public static addRequestInterceptor(interceptor: RequestInterceptor) {
        this.requestInterceptors.push(interceptor);
    }
    public static addResponseInterceptor(interceptor: ResponseInterceptor) {
        this.responseInterceptors.push(interceptor);
    }

    // Hooks
    public static CheckIfTokenExpired : (error: HTTPError) => Promise<boolean>
        = () => new Promise(resolve => resolve(false))
    
    public static RefreshToken: (refreshToken: string, token?: string) => Promise<boolean>
        = (refreshToken: string, token?: string) => new Promise(resolve => resolve(false))

    ////////////////

    private static generateRequest(method: HTTPMethod, url: string, urlParams?: any) {

        const req : Request = {
            method,
            url: '',
            baseUrl: undefined,
            data: {},
            headers: {},
            dataFormat: 'json',
            responseType: 'json',
            isRefresh: false,
            fakeRequestAction: null,
            fullResponse: false,
            refreshConsumed: false,
            promiseCallbacks: undefined,

            setMethod(method: HTTPMethod) : Request {
                this.method = method;
                return this;
            },
            set(data: any) : Request {
                Object.keys(data)
                .forEach((k: string) => {
                    this.data[k] = data[k];
                })
                return this;
            },
            setUrl(url: string, parameters?: any) : Request {
                let u = url;
                if (parameters) {
                    Object.keys(parameters)
                    .forEach((k: string) => {
                        u = u.replace(':' + k, encodeURIComponent(parameters[k]))
                    })
                }

                this.url = u;
                return this;
            },
            setBaseURL(base: string) : Request {
                this.baseUrl = base;
                return this;
            },
            setHeaders(headers: any) : Request {
                this.headers = headers;
                return this;
            },
            setDataFormat(format: HTTPDataFormat) : Request {
                this.dataFormat = format;
                return this;
            },
            setResponseType(type: HTTPResponseType) {
                this.responseType = type;
                return this;
            },
            then(callback: (value: any) => void) {
                return http.exec(this).then(callback);
            },
            fakeResponse(action: (request: Request) => Promise<void>) : Request {
                this.fakeRequestAction = action;
                return this;
            },
            getFullResponse() {
                this.fullResponse = true;
                return this;
            }
        }

        const u = this.mappedEndpoints[url] ? 
            this.mappedEndpoints[url] : url;

        req.setUrl(u, urlParams);

        return req;

    }

    public static request(url: string = '', urlParams?: any) {
        return this.generateRequest('GET', url, urlParams);
    }

    public static get(url: string = '', urlParams?: any) {
        return this.generateRequest('GET', url, urlParams);
    }

    public static post(url: string = '', urlParams?: any) {
        return this.generateRequest('POST', url, urlParams);
    }

    public static put(url: string = '', urlParams?: any) {
        return this.generateRequest('PUT', url, urlParams);
    }

    public static delete(url: string = '', urlParams?: any) {
        return this.generateRequest('DELETE', url, urlParams);
    }

    private static resolveRequestInterceptors(req: RequestAttempt, index: number = 0) : Promise<void> {
        return new Promise((resolve, reject) => {

            // If no more interceptors, end here
            if (index >= this.requestInterceptors.length) {
                return resolve();
            }

            // Run current interceptor
            this.requestInterceptors[index]()
            .then(() => {

                // Run next interceptor
                this.resolveRequestInterceptors(req, index + 1)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })

            })

            // If interceptor rejected, return error. Request failed.
            .catch(err => {
                reject(err);
            })
        })
    }

    private static resolveResponseInterceptors(response: any, request: RequestAttempt, index: number = 0) {
        return new Promise((resolve, reject) => {

            // If no more interceptors, end here
            if (index >= this.responseInterceptors.length) {
                return resolve(response);
            }

            // Run current interceptor
            this.responseInterceptors[index]()
            .then(() => {

                this.resolveResponseInterceptors(response, request, index + 1)
                .then(() => {
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                })

            })

            // If interceptor rejected, return error. Request failed, even if it was a 200.
            .catch(err => {
                reject(err);
            })
        })
    }

    private static exec(request: Request) {
        return new Promise((resolve, reject) => {

            // Check if this is a refresh request
            request['isRefresh'] = this.nextRequestIsRefresh;
            this.nextRequestIsRefresh = false; 
            
            // Get request data (empty object if not specified)
            const data = request.data ? request.data : {}

            //// Check fake api
            if (request.fakeRequestAction) {
                setTimeout(() => {
                    request.fakeRequestAction!(request)
                    .then((response) => {
                        resolve(response);
                    })
                }, 250 + (Math.random() * 250));
                return;
            }
            ///////////
    
            // Build headers
            const defaultHeaders : any = {
                'Content-Type': 'application/json'
            }

            const tk = this.getToken();
            if (tk) {
                defaultHeaders['Authorization'] = tk;
            }

            // Load global headers
            this.globalHeadersAction(request)
            .then((headers: any) => {
    
                // Merge into previous headers
                Object.keys(defaultHeaders)
                .forEach((k: string) => {
                    if (!headers[k]) {
                        headers[k] = defaultHeaders[k];
                    }
                });

                // Add specific request headers
                if (request.headers) {
                    Object.keys(request.headers)
                    .forEach((k: string) => {
                        headers[k] = request.headers[k];
                    });
                }

                // URL query params
                let urlparams = '';
                if (!['POST', 'PUT'].includes(request.method)) {
                    let char = '?';
                    Object.keys(data).forEach(k => {
                        const val = data[k];
    
                        if (Array.isArray(val)) {
    
                            for(const i of val) {
                                urlparams += char + k + '=' + encodeURIComponent(i);
                                char = '&';
                            }
    
                        } else {
                            urlparams += char + k + '=' + encodeURIComponent(data[k]);
                            char = '&';
                        }
                    });
                }

                // Build final url
                const url : string = (request.baseUrl !== undefined ? request.baseUrl : http.baseURL) + request.url + urlparams;

                // Prepare a provisional request attempt
                const attempt : RequestAttempt = {
                    url,
                    method: request.method,
                    data: data,
                    headers,
                    dataFormat: request.dataFormat,
                    responseType: request.responseType,
                    fullResponse: request.fullResponse
                }

                // Execute interceptors, which may modify the request attempt
                this.resolveRequestInterceptors(attempt)
                .then(() => {

                    let dta : any = {};

                    if (['POST', 'PUT'].includes(attempt.method)) {
                        // Body
                        dta = attempt.data;
    
                        if (attempt.dataFormat == 'formData') {
                            const form = new FormData();
                            Object.keys(attempt.data)
                            .forEach((key: string) => {
                                if (!Array.isArray(attempt.data[key]))
                                    form.append(key, attempt.data[key]);
                                else {
                                    arrayToFormData(form ,key, attempt.data[key]);
                                }  
                            });
                            delete attempt.headers['Content-Type'];
                            dta = form;
                        }
    
                        else if (attempt.dataFormat == 'urlencoded') {
                            attempt.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                            dta = new URLSearchParams(attempt.data);
                        }
    
                        else if (attempt.dataFormat == 'plain') {
                            attempt.headers['Content-Type'] = 'text/plain';
                        }
    
                        else if (attempt.dataFormat == 'html') {
                            attempt.headers['Content-Type'] = 'text/html';
                        }
    
                        else if (attempt.dataFormat == 'xml') {
                            attempt.headers['Content-Type'] = 'text/xml';
                        }
    
                    }

                    axios({
                        method: attempt.method,
                        url: attempt.url,
                        data: dta,
                        headers: attempt.headers,
                        responseType: attempt.responseType ? attempt.responseType : 'json'
                    })
                    .then( (response:any) => {

                        // Run response interceptors
                        this.resolveResponseInterceptors({
                            error: false,
                            response: response
                        }, attempt)
                        .then(() => {
                            if (!attempt.fullResponse)
                                resolve(response.data);
                            else
                                resolve(response);
                        })

                        // Rejected by interceptor
                        .catch(reason => {
                            const err : HTTPError = {
                                url: attempt.url,
                                method: attempt.method,
                                status: 0,
                                data: reason,
                                headers: {}
                            }
                            reject(err);
                        });

                    })
                    .catch((error: any) => {
    
                        const err : HTTPError = {
                            url: error.config.url,
                            method: error.response.method,
                            status: error.response ? error.response.status : 0,
                            data: error.response ? error.response.data : {},
                            headers: error.response ? error.response.headers : {}
                        }

                        // Run response interceptors
                        this.resolveResponseInterceptors({
                            error: true,
                            response: err
                        }, attempt)
                        .then(() => {

                            if (!this.refreshingToken) {
    
                                // Try to refresh token
                                this.CheckIfTokenExpired(err)
                                .then( (expired: boolean) => {
        
                                    if (expired) {
        
                                        if (request.refreshConsumed) {
                                            if (request.promiseCallbacks) {
                                                request.promiseCallbacks.reject(err);
                                            } else {
                                                reject(err);
                                            }
                                            return;
                                        }
        
                                        this.refreshingToken = true;
                                        request.refreshConsumed = true;
                                        this.nextRequestIsRefresh = true;
        
                                        // Add this request to pendings after refresh
                                        request.promiseCallbacks = {
                                            resolve: resolve,
                                            reject: reject
                                        };
                                        this.pendingRequests.push(request);
        
                                        this.RefreshToken(this.getRefreshToken())
                                        .then((refreshed: boolean) => {
        
                                            if (!refreshed) {
                                                for(const req of this.pendingRequests) {
                                                    if (req.promiseCallbacks) {
                                                        req.promiseCallbacks.reject(err);
                                                    }
                                                }
                                                this.refreshingToken = false;
                                            } else {
                                                for(const req of this.pendingRequests) {
                                                    this.exec(req)
                                                    .then((data) => {
                                                        if (req.promiseCallbacks) {
                                                            req.promiseCallbacks.resolve(data);
                                                        }
                                                    }).catch(err => {
                                                        if (req.promiseCallbacks) {
                                                            req.promiseCallbacks.reject(err);
                                                        }
                                                    });
                                                }
                                                this.refreshingToken = false;
                                            }
        
                                        })
                                        .catch((err) => {
                                            for(const req of this.pendingRequests) {
                                                if (req.promiseCallbacks) {
                                                    req.promiseCallbacks.reject(err);
                                                }
                                            }
                                        });
        
                                    } else {
                                        reject(err);
                                    }
        
                                });
        
                            } else {
        
                                if (!request.isRefresh) {
                                    request.promiseCallbacks = {
                                        resolve: resolve,
                                        reject: reject
                                    };
                                    this.pendingRequests.push(request);
                                } else {
                                    reject(err);
                                }
        
                            }
                            
                        })
    
                    });

                })

                // Rejected by interceptor
                .catch(reason => {
                    const err : HTTPError = {
                        url: attempt.url,
                        method: attempt.method,
                        status: 0,
                        data: reason,
                        headers: {}
                    }
                    reject(err);
                });

            });

        });
    }

} 