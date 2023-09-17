import { defineComponent } from 'vue';
import Config from '../../modules/config';

export default defineComponent({

    props: {
        name: {type: String, required: true}
    },

    data() {
        const data : {
            iconName: string,
            lib: string
        } = {
            iconName: '',
            lib: ''
        }
        return data;
    },

    created() {
        this.parseName();
    },

    methods: {

        parseName() {
            this.iconName = this.name;
            if (this.name.indexOf('/') >= 0) {
                const parts = this.name.split('/');
                this.iconName = parts[1];
                this.lib = parts[0];
            }
        },

        iconStyle() {
            if (this.$attrs.onClick) {
                return {cursor: 'pointer'}
            }
            return {}
        }
    },

    watch: {
        $props: {
            handler() {
                this.parseName();
            },
            deep: true,
            immediate: true,
        },
    },
});