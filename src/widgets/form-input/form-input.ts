import { defineComponent, markRaw, PropType } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import Password from 'primevue/password';
import Calendar from 'primevue/calendar';
import Editor from 'primevue/editor';
import InputMask from 'primevue/inputmask';
import Chips from 'primevue/chips';
import ColorPicker from 'primevue/colorpicker';
import Slider from 'primevue/slider';
import Utils from '../../modules/utils';
import IOption from '../../interfaces/IOption';
import Time from '../../modules/time';
import AutoComplete from 'primevue/autocomplete';
import MultiSelect from 'primevue/multiselect';
import FilePicker from '../file-picker/file-picker.vue';
import utils from '../../modules/utils';
import translate from '../../modules/translator';
import VideoPlayer from '../video-player/video-player.vue';

export default defineComponent({

    name: 'form-input',

    components: { InputText, 
        InputNumber, 
        Checkbox, 
        Dropdown, 
        InputSwitch, 
        Password, 
        Calendar, 
        Editor, 
        Textarea, 
        InputMask,
        Chips,
        ColorPicker,
        Slider,
        AutoComplete,
        MultiSelect,
        FilePicker,
        VideoPlayer
    },

    props: {

        modelValue: {},

        type: {
            type: String as PropType<
            'text'
            |'email'
            |'number'
            |'checkbox'
            |'select'
            |'phone'
            |'country'
            |'toggle'
            |'date'
            |'editor'
            |'textarea'
            |'tags'
            |'password'
            |'slider'
            |'color'
            |'media'
            |'image'
            |'video'
            |'search'>,
            default: 'text'
        },

        pass: {
            type: Object as PropType<any>
        },

        label: {
            type: String
        },
        floatLabel: {
            type: String
        },

        inputId: {
            type: String
        },

        disabled: {},

        loading: {},

        invalid: {},

        placeholder: {
            type: String
        },

        help: {
            type: String
        },

        stopTime: {
            type: Number,
            default: 300
        },

        // Text
        mask: {
            type: String
        },

        // Number - currency
        currency: {
            type: String
        },

        // Dropdown
        options: {
            type: Object as PropType<IOption[]>
        },
        comparer: {
            type: Function as PropType<(a: any, b: any) => boolean>,
            default: (a: any, b: any) => a && b && (a == b || (a.id && a.id == b.id) || (a.value && a.value == b.value) )
        },
        multiple: {
            type: Boolean
        },

        // Password
        instructions: {
            type: String
        },

        // Date
        dateFormat: {
            type: String,
            default: 'dd/mm/yy'
        },
        returnFormat: {
            type: String,
            default: 'Time'
        },

        // Picker
        accept: {
            type: String
        },
        canDelete: {
            type: Boolean,
            default: true
        },

        // Editor
        toolbar: {
            type: Object as PropType<'basic'|'medium'|'advanced'|String[][]>
        },

        // Slider
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        range: {
            type: Boolean,
            default: false
        },

        // Suggestions
        suggestions: {
            type: Object as PropType<IOption[]>
        }
    },

    data: function() {

        const data : {
            inputName: string,
            selectOption: IOption|null,
            selectedOptions: IOption[],
            dateValue: Date|Date[]|null,
            writeCount: number,
            mediaSrc: any,
            mediaType: 'image'|'video'
        } = {
            inputName: '',
            selectOption: null,
            selectedOptions: [],
            dateValue: null,
            writeCount: 0,
            mediaSrc: null,
            mediaType: 'image'
        }
        return data;
    },

    created() {
        this.updateLocalValue();
    },

    methods: {

        isInvalid() : boolean {
            if (this.invalid === undefined) return false;
            if (typeof(this.invalid) == 'boolean') return this.invalid;
            return (this.invalid as Function)();
        },

        isDisabled() : boolean {
            if (this.disabled === undefined) return false;
            if (typeof(this.disabled) == 'boolean') return this.disabled;
            return (this.disabled as Function)();
        },

        isLoading() : boolean {
            if (this.loading === undefined) return false;
            if (typeof(this.loading) == 'boolean') return this.loading;
            return (this.loading as Function)();
        },

        pressEnter() {
            setTimeout(() => {
                this.$emit('pressEnter');
            }, 5)
        },

        focus() {

            const focusInput = (ref: string, direct: boolean = false) => {
                const el : HTMLElement = (this.$refs as any)[ref].$el;
                const tag = el.tagName;

                if (direct || ['input', 'textarea'].includes(tag.toLowerCase())) 
                    el.focus();
                else {
                    const input = el.querySelector('input');
                    if (input) {
                        input.focus();
                    }
                }
            }

            if (['text', 'email'].includes(this.type)) {
                focusInput('textInput');
            }
            else if (this.type == 'search') {
                focusInput('searchInput');
            }
            else if (this.type == 'password') {
                focusInput('passwordInput');
            }
            else if (this.type == 'textarea') {
                focusInput('textareaInput');
            }
            else if (this.type == 'number') {
                focusInput('numberInput');
            }
        },

        classnames() {
            const cl : any = {
                'p-float-label': !!this.floatLabel, 
                disabled: this.isDisabled(), 
                invalid: this.isInvalid()
            }

            cl['type-' + this.type] = true;

            return cl;
        },
        inputClassnames() {
            const cl : any = {
                'p-invalid': this.isInvalid()
            }

            return cl;
        },

        getName() {
            if (!this.inputName) {
                if (this.inputId) {
                    this.inputName = this.inputId
                } else {
                    this.inputName = Utils.randomString(5);
                }
            }
        },

        bindProps() {
            let obj = this.pass ? this.pass : {}

            obj = {
                ...obj,
                inputId: this.inputName
            }

            if (this.placeholder) {
                obj['placeholder'] = this.placeholder;
            }

            if (this.type == 'textarea') {

                if (obj['autoResize'] === undefined) {
                    obj['autoResize'] = true;
                }

            }

            else if (['number'].includes(this.type)) {
                if (obj['useGrouping'] === undefined) {
                    obj['useGrouping'] = false;
                }

                if (this.currency) {
                    obj['mode'] = 'currency';
                    obj['currency'] = this.currency;
                }
            }

            else if (this.type == 'password') {
                if (obj['feedback'] === undefined) {
                    obj['feedback'] = this.instructions ? true : false;
                }
                if (obj['toggleMask'] === undefined) {
                    obj['toggleMask'] = true;
                }
                
            }

            else if (['date'].includes(this.type)) {
                if (obj['showIcon'] === undefined) {
                    obj['showIcon'] = true;
                }

                if (this.dateFormat) {
                    obj['dateFormat'] = this.dateFormat
                }

                if (obj['selectionMode'] == 'range' && obj['showTime']) {
                    if (!this.dateValue || (Array.isArray(this.dateValue) && this.dateValue.length == 0)) {
                        obj['showTime'] = false;
                    }
                }
            }

            else if (['rating'].includes(this.type)) {
                if (obj['cancel'] === undefined) {
                    obj['cancel'] = false;
                }
            }

            else if (this.type == 'slider') {
                if (obj['min'] === undefined) {
                    obj['min'] = this.min;
                }
                if (obj['max'] === undefined) {
                    obj['max'] = this.max;
                }
                if (obj['range'] === undefined) {
                    obj['range'] = this.range;
                }
            }

            return obj;
        },

        getDropdownOptions() {
            if (!this.options) return [];
            return this.options;
        },

        getToolbar() {
            if (!this.toolbar) return [];

            let def : any = this.toolbar;

            if (this.toolbar == 'basic') {
                def = [
                    ['bold', 'italic', 'underline'],
                    ['list', 'align-center', 'align-right', 'align-justify']
                ];
            }
            else if (this.toolbar == 'medium') {
                def = [
                    ['bold', 'italic', 'underline', 'size'],
                    ['align-center', 'align-right', 'align-justify'],
                    ['list', 'link', 'image']
                ]
            }

            const toolbar : any[][] = [];

            for(const row of def) {
                const line = [];

                for(const item of row) {

                    let classname = item;
                    let value = undefined;
                    let type = 'btn';

                    const obj: any = {}

                    if (item.includes('list')) {
                        if (item.includes('-')) {
                            const parts = item.split('-');
                            classname = 'list';
                            value = parts[1];
                        } else {
                            value = 'bullet';
                        }
                    }
                    else if (item.includes('align'))
                    {
                        const parts = item.split('-');
                        classname = 'align';
                        value = parts[1];
                    }
                    else if (item == 'size') {
                        type = 'select';
                        obj['options'] = ['small', 'large', 'huge']
                        value = 'small';
                    }
                    else if (['color', 'background'].includes(item)) {
                        type = 'select';
                        obj['options'] = ['black', 'white', 'gray', '#bf2424', '#223994', '#319422', '#bfb524', '#a324bf']
                    }

                    line.push({
                        ...obj,
                        class: classname,
                        value,
                        type
                    })

                }

                toolbar.push(line);
            }

            return toolbar;
        },

        suggestionSelected(arg: any) {
            this.$emit('suggestion-selected', arg);
            this.setValue(arg);
        },

        passEmit(event: string, arg?: any) {
            this.$emit(event, arg);
        },

        updateLocalValue(value?: any) {

            const val = value !== undefined ? value : this.modelValue;
            if (!val) return;

            if (this.type == 'select') {

                if (this.selectOption && this.comparer(val, this.selectOption.value)) {
                    return;
                }

                const list = this.options ? this.options : (this.suggestions ? this.suggestions : null);

                if (list) {
                    for(const op of list) {

                        if (!op.items) {
                            if (this.comparer(val, op.value)) {
                                if (this.selectOption && op == this.selectOption) break;
                                this.selectOption = op;
                                break;
                            }
                        } else {
                            let shouldBreak = false;

                            for(const child of op.items) {
                                if (this.comparer(val, child.value)) {
                                    if (this.selectOption && child == this.selectOption) break;
                                    this.selectOption = child;
                                    shouldBreak = true;
                                    break;
                                }
                            }

                            if (shouldBreak) break;
                        }

                    }
                }
            }
            else if (this.type == 'date') {

                const rt = this.returnFormat ? this.returnFormat.toLowerCase() : undefined;

                if (rt && rt != 'date') {

                    // Selection model
                    const mode = this.pass && this.pass.selectionMode ? this.pass.selectionMode  : 'simple';

                    if (mode == 'simple') {
                        const t = Time.instance(this.modelValue, rt == 'time' ? undefined : this.returnFormat);
                        this.dateValue = t.toDate();
                    }
                    else if (mode == 'multiple') {

                        if (Array.isArray(val)) {
                            const aux = [];
                            for(const dt of val) {
                                if (rt == 'date') {
                                    aux.push(dt);
                                } else if (rt == 'time') {
                                    aux.push(dt.toDate())
                                } else {
                                    aux.push(Time.instance(dt, this.returnFormat));
                                }
                            }
                            this.dateValue = aux;
                        }
                    }
                    else if (mode == 'range') {

                        if (Array.isArray(val)) {
                            const aux = [];
                            for(const dt of val) {
                                if (!dt) {
                                    aux.push(dt);
                                }
                                else if (rt == 'date') {
                                    aux.push(dt);
                                } else if (rt == 'time') {
                                    aux.push(dt.toDate())
                                } else {
                                    aux.push(Time.instance(dt, this.returnFormat));
                                }
                            }
                            this.dateValue = aux;
                        }

                    }

                }    
    
            }
        },

        setValue($e: any) {
            this.$emit('update:modelValue', $e);
            this.$emit('change', $e);
        },

        updateValue($e: any) {

            const currentWriteCount = this.writeCount + 1;
            this.writeCount = currentWriteCount;

            const stopEvent = () => {
                setTimeout(() => {
                    if (currentWriteCount == this.writeCount) {
                        this.$emit('stop');
                    }
                }, this.stopTime);
            }

            if (['text', 'email', 'password', 'textarea', 'search'].includes(this.type)) {
                if (this.mask) {
                    this.setValue($e);
                } else {
                    this.setValue($e.target.value);
                }
                stopEvent();
            }
            else if (['number'].includes(this.type)) {
                this.setValue($e.value);
                stopEvent();
            }
            else if (['checkbox', 'toggle', 'tags', 'color', 'slider'].includes(this.type)) {
                this.setValue($e);
                if (['tags', 'slider'].includes(this.type)) {
                    stopEvent();
                }
            }
            else if (['select'].includes(this.type)) {

                if (this.multiple) {

                    const arr : IOption[] = [];
                    for(const i of $e) {
                        arr.push(i.value);
                    }
                    this.selectedOptions = $e;
                    this.setValue(arr);

                } else {
                    if ($e.value === undefined) {
                        this.selectOption = null;
                        this.setValue($e.value);
                    } else {
                        this.selectOption = $e;
                        this.setValue($e.value);
                    }
    
                    if (this.suggestions) {
                        stopEvent();
                    }
                }

            }
            else if (['date'].includes(this.type)) {

                // Selection mode
                const mode = this.pass && this.pass.selectionMode ? this.pass.selectionMode  : 'simple';

                // Format to convert the date before updating modelValue
                const rt = this.returnFormat ? this.returnFormat.toLowerCase() : undefined;

                if (mode == 'simple') {

                    // Value to be used, once converted to the "rt" format.
                    const val : any = rt == 'date' ? $e
                        : (rt == 'time' ? Time.fromDate($e) : Time.fromDate($e).format(this.returnFormat));

                    this.setValue(val);


                } else if (mode == 'multiple') {

                    const aux = [];
                    for(const d of $e) {
                        // Value to be used, once converted to the "rt" format.
                        const val : any = rt == 'date' ? d
                        : (rt == 'time' ? Time.fromDate(d) : Time.fromDate(d).format(this.returnFormat));
                        aux.push(val);
                    }
                    this.setValue(aux);

                } else if (mode == 'range') {

                    const aux = [];
                    for(const d of $e) {

                        if (!d) {
                            aux.push(d);
                            continue;
                        }

                        // Value to be used, once converted to the "rt" format.
                        const val : any = rt == 'date' ? d
                        : (rt == 'time' ? Time.fromDate(d) : Time.fromDate(d).format(this.returnFormat));
                        aux.push(val);
                    }
                    this.setValue(aux);

                }


            }
            else if (this.type == 'editor') {
                this.setValue($e.target.innerHTML);
                stopEvent();
            }
        },

        imagePicked(file: File) {
            this.mediaType = this.getMediaType(file)!;
            this.mediaSrc = utils.fileToURL(file);

            this.setValue(file);
        },

        getMediaType(file?: File) : 'image'|'video'|undefined {
            const accept = this.accept ? this.accept : '';

            if (this.type == 'image') {
                return 'image';
            } else if (this.type == 'video') {
                return 'video';
            } else {
                if (accept.includes('image')) {
                    if (!accept.includes('video')) {
                        return 'image';
                    }
                } else if (accept.includes('video')) {
                    if (!accept.includes('image')) {
                        return 'video';
                    }
                }
            }

            if (file) {
                if (utils.isImage(file)) return 'image';
                return 'video';
            }

            return undefined;
        },

        mediaPickerLabel() {
            const accept = this.accept ? this.accept : '';

            let str = 'media.select';
            const type = this.getMediaType();

            if (type != undefined) {
                str += utils.capitalize(type);
            }

            return translate.get(str);
        },

        mediaAccept() {
            if (this.accept) {
                return this.accept;
            }

            if (this.type == 'media') return 'image/*,video/*';
            if (this.type == 'video') return 'video/*';
            return 'image/*';
        },

        removeFile() {
            this.setValue(null);
            this.mediaSrc = undefined;
            this.mediaType = 'image';
        }
    },

    watch: {
        modelValue(newValue: any, oldValue: any) {
            this.updateLocalValue(newValue);
        }
    }

})