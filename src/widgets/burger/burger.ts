import { defineComponent } from 'vue';

export default defineComponent({

    props: {
        color: {
            type: String
        }
    },

    data() {
        const data : {
            open: boolean
        } = {
            open: false
        }

        return data;
    },

    methods: {
        getColor() {
            if (this.color) return this.color;
            return 'black';
        },

        toggle() {
            this.open = !this.open;

            this.$emit('change', this.open);
            this.$emit('click', this.open);
            this.$emit('input', this.open);
        }
    }
});