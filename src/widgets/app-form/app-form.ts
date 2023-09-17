import { defineComponent, PropType } from 'vue';
import FormInput from '../form-input/form-input.vue';
import FilePicker from '../file-picker/file-picker.vue';
import CircleImage from '../circle-image/circle-image.vue';
import translate from '../../modules/translator';

export type AppFormField = {
    model?: any,
    name?: string,
    label?: string,
    type?: string,
    col?: number|string|{
        col?: number|string,
        xs?: number|string,
        sm?: number|string,
        md?: number|string,
        lg?: number|string,
    },
    props?: any,
    required?: boolean,
    validate?: (value: any) => string|undefined|null,
    component?: any,
    submit?: (form: {validate: (all?: boolean) => boolean}) => any
}

export default defineComponent({

    components: { FormInput, FilePicker, CircleImage },

    props: {
        fields: {
            type: Function as PropType<(() => AppFormField[])>,
            required: true
        },
        defaultGrid: {
            type: Object as PropType<{
                col?: number|string,
                xs?: number|string,
                sm?: number|string,
                md?: number|string,
                lg?: number|string,
            }>
        }
    },

    data() {
        const data : {
            _fields: any
        } = {
            _fields: null
        }
        return data;
    },

    created() {
        if (!this.fields) return false;
        this._fields = this.fields();
    },

    methods: {

        fieldLabel(field: AppFormField) {
            if (!field.label) return undefined;

            let str = field.label;
            if (field.required) {
                str += '<span class="required">*</span>';
            }

            return str;
        },

        columnClasses(field: AppFormField) {

            if (!field.col) {
                return {
                    'col-1': true
                }
            }

            const obj : any = {}

            if (typeof field.col == 'number' || typeof field.col == 'string') {
                obj['col-' + field.col] = true;
                return obj;
            }

            const g = this.defaultGrid ? this.defaultGrid : {};

            const sizes : any = {
                col: field.col.col ? field.col.col : (g.col ? g.col : 1)
            }

            sizes['xs'] = field.col.xs ? field.col.xs : (g.xs ? g.xs : sizes['col']);
            sizes['sm'] = field.col.sm ? field.col.sm : (g.sm ? g.sm : sizes['xs']);
            sizes['md'] = field.col.md ? field.col.md : (g.md ? g.md : sizes['sm']);
            sizes['lg'] = field.col.lg ? field.col.lg : (g.lg ? g.lg : sizes['md']);

            obj['col-' + sizes.col] = true;
            obj['col-xs-' + sizes.xs] = true;
            obj['col-sm-' + sizes.sm] = true;
            obj['col-md-' + sizes.md] = true;
            obj['col-lg-' + sizes.lg] = true;
            return obj;
        },

        validate(all: boolean = true) {

            let someError : boolean = false;

            for(const field of this._fields) {

                if (!field.model) continue;
                const val = field.model[field.name];
                field['error'] = undefined;

                if (!field.validate) {

                    if (field.required && !val) {
                        field['error'] = translate.get('forms.errors.required');
                        someError = true;

                        if (!all)
                        return false;
                    }

                } else {
                    const resp = field.validate(val);
                    if (resp) {
                        field['error'] = resp;
                        someError = true;

                        if (!all)
                        return false;
                    }
                }

            }

            return !someError;

        },

        submit($e: any, field: AppFormField) {
            $e.preventDefault();
            field.submit!(this);
        }
    },

    watch: {
        modelValue(newValue: any, oldValue: any) {
            this._fields = this.fields();
        }
    }

});