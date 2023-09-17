import { defineComponent } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import Btn from '../../widgets/btn/btn.vue';
import translate from '../../modules/translator';
import App from '../../modules/app';

export default defineComponent({
    props: ['src', 'onSave', 'ratio'],
    components: {Cropper, Btn},

    data() {
        const data = {
            cropped: '',
            stencilProp: {
                aspectRatio: '1'
            }
        }
        return data;
    },

    mounted() {
        if (this.ratio)
        this.stencilProp.aspectRatio = this.ratio
    },
    methods: {
        $t(key: string) {
            return translate.get(key);
        },
        cropperChange($event: any) {
            this.cropped = $event.canvas.toDataURL();
            this.$emit('change', this.cropped);
        },

        cancel() {
            App.modal.close();
        },

        crop() {
            App.modal.close();
            this.$emit('save', this.cropped);
            if (this.onSave) {
                this.onSave(this.cropped);
            }
        }
    }
});