import { defineComponent, PropType } from 'vue';

export default defineComponent({

    props: {
        value: {
            type: Boolean
        },
        onChange: {
            type: Function as PropType<(value: boolean) => void>
        },
        disabled: {
            type: Object as PropType<Boolean|(() => Boolean)>
        },
        icon: {
            type: String,
            default: 'heroicons-outline/check'
        }
    },

    methods: {

        isDisabled() {
            if (this.disabled === undefined) return false;
            if (typeof this.disabled == 'boolean') return this.disabled;
            return (this.disabled as Function)();
        },

        onclick() {
            if (this.isDisabled()) return;
            
            this.$emit('input', !this.value);
            this.$emit('change', !this.value);
            if (this.onChange) {
                this.onChange(!this.value);
            }
        }
    }

})