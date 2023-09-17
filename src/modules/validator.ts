
export default class Validator {

    private value: any;
    private checks: any[];

    constructor(value : any) {
        this.value = value;
        this.checks = [];
    }

    static for(value: any) {
        return new Validator(value);
    }

    isString() {
        this.checks.push({
            function: function(value: any) {
                return typeof value == 'string';
            }
        });

        return this;
    }

    is(e: any) {

        this.checks.push({
            function: function(value: any, param: any) {
                return value === param;
            },
            parameter: e
        });

        return this;

    }

    isNot(e: any) {

        this.checks.push({
            function: function(value: any, param: any) {
                return value != param;
            },
            parameter: e
        });

        return this;

    }

    typeIs(type: string|string[]) {

        this.checks.push({
            function: function(value: any, param: string|string[]) {
                const type = typeof value;
                const types = typeof param == 'string' ? [param] : param;

                for(const t of types) {
                    if (type == t) {
                        return true;
                    }
                }
                return false;
            },
            parameter: type
        });

        return this;

    }

    typeIsNot(type: string|string[]) {

        this.checks.push({
            function: function(value: any, param: string|string[]) {
                const type = typeof value;
                const types = typeof param == 'string' ? [param] : param;

                for(const t of types) {
                    if (type == t) {
                        return false;
                    }
                }
                return true;
            },
            parameter: type
        });

        return this;

    }

    isArray() {

        this.checks.push({
            function: function(value: any) {
                return Array.isArray(value);
            },
        });

        return this;

    }

    isNotArray() {

        this.checks.push({
            function: function(value: any) {
                return !Array.isArray(value);
            },
        });

        return this;

    }

    contains(e: any) {

        this.checks.push({
            function: function(value: any, param: any) {
                return value.includes(param);
            },
            parameter: e
        });

        return this;

    }

    notContains(e: any) {

        this.checks.push({
            function: function(value: any, param: any) {
                return !value.includes(param);
            },
            parameter: e
        });

        return this;

    }

    minLength(length: number) {
        this.checks.push({
            function: function(value: any, param: number) {
                return value.length >= param;
            },
            parameter: length
        });

        return this;
    }

    maxLength(length: number) {
        this.checks.push({
            function: function(value: any, param: number) {
                return value.length <= param;
            },
            parameter: length
        });

        return this;
    }

    isEmail() {
        this.checks.push({
            function: function(value: any) {
                if (typeof value != 'string') return false;
                if (value.length < 5) return false;
                if (!value.includes('@')) return false;
                if (!(value.split('@')[1]).includes('.') ) return false;

                return true;
            }
        });

        return this;
    }

    isUppercase() {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return false;
                if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value)) {
                    return false;
                }
                return value == value.toUpperCase();
            }
        });

        return this;
    }

    isLowercase() {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return false;
                if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value)) {
                    return false;
                }
                return value == value.toLowerCase();
            }
        });

        return this;
    }

    hasUppercase(min = 1) {
        this.checks.push({
            function: function(value: string, param: number) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i].toUpperCase() == value[i]) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }

                }

                return false;
            },
            parameter: min
        });

        return this;
    }

    hasNotUppercase() {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i] == value[i].toUpperCase()) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    hasLowercase(min = 1) {
        this.checks.push({
            function: function(value: string, param: number) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i] == value[i].toLowerCase()) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }
                }

                return false;
            },
            parameter: min
        });

        return this;
    }

    hasNotLowercase() {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (!/^[a-zA-ZàáäâéèëêìíïîòóöôùúüûñÑÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛ]+$/.test(value[i])) {
                        continue;
                    }

                    if (value[i] == value[i].toLowerCase()) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    isNumber() {
        this.checks.push({
            function: function(value: string|number) {
                if(typeof value == 'number') {
                    return true;
                }

                const chars = '+-0123456789,.';

                for(let i = 0; i < value.length; ++i) {
                    if (!chars.includes(value[i])) {
                        return false;
                    }
                }
                return true;
            }
        });

        return this;
    }

    hasNumbers(min = 1) {

        this.checks.push({
            function: function(value: any, param: number) {

                let count = 0;

                for(let i = 0; i < value.length; ++i) {

                    if ('0123456789'.includes(value[i])) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }
                }

                return false;
            },
            parameter: min
        });

        return this;

    }

    hasNotNumbers() {

        this.checks.push({
            function: function(value: string) {

                for(let i = 0; i < value.length; ++i) {
                    if ('0123456789'.includes(value[i])) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;

    }

    isLetters() {
        this.checks.push({
            function: function(value: string) {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(value);
            }
        });

        return this;
    }

    hasLetters(min = 1) {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(value[i])) {
                        count += 1;

                        if (count >= min) {
                            return true;
                        }
                    }
                }

                return false;
            }
        });

        return this;
    }

    hasNotLetters() {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]+$/.test(value[i])) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    isSpecialChars() {
        this.hasSpecialChars(this.value.length);
        return this;
    }

    hasSpecialChars(min = 1) {
        this.checks.push({
            function: function(value: string, param: number) {
                if (typeof value != 'string') return false;

                let count = 0;

                for(let i = 0; i < value.length; ++i) {
                    if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value[i])) {
                        count += 1;

                        if (count >= param) {
                            return true;
                        }
                    }
                }

                return false;
            },
            parameter: min
        });

        return this;
    }

    hasNotSpecialChars() {
        this.checks.push({
            function: function(value: string) {
                if (typeof value != 'string') return true;

                for(let i = 0; i < value.length; ++i) {
                    if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value[i])) {
                        return false;
                    }
                }

                return true;
            }
        });

        return this;
    }

    isPhone() {

        this.checks.push({
            function: function(value: string) {

                const v = "" + value;

                const valid = '+0123456789 -()';
                for(let i = 0; i < v.length; ++i) {
                    if (!valid.includes(v[i])) {
                        return false;
                    }
                }
                
                return true;
            }
        });

        return this;
    }

    isBool() {
        this.checks.push({
            function: function(value: boolean) {
                return typeof value == 'boolean'
            }
        });

        return this;
    }

    has(property: string) {
        this.checks.push({
            function: function(value: any, param: string) {
                return value[param] !== undefined;
            },
            parameter: property
        }); 

        return this;
    }

    notEmpty() {
        this.checks.push({
            function: function(value: any) {
                if (!value) return false;
                
                if (Array.isArray(value)) {
                    if (value.length == 0) return false;
                } else {
                    return !value;
                }

                return true;
            }
        }); 

        return this;
    }

    validate(value = undefined) {

        if (value !== undefined) {
            this.value = value;
        }

        for(const check of this.checks) {

            const func = check['function'];
            const param = check['parameter'];

            const valid = func(this.value, param);

            if (!valid) {
                return false;
            }

        }

        return true;

    }

}