import { defineComponent, PropType } from 'vue';

export default defineComponent({

    props: {
        onDrop: { type: Function },
        clickable: { type: Boolean, default: true },
        droppable: { type: Boolean, default: true },
        multiple: { type: Boolean },
        maxSize: { type: Number },
        accept: { type: String },
        disabled: {
            type: [Boolean, Function] as PropType<boolean | (()=>boolean)>
        }
    },

    methods: {
        
        isDisabled() : boolean {
            if (!this.disabled) return false;
            if (typeof this.disabled == 'boolean') return this.disabled;
            return this.disabled();
        },

        triggerInput() {
            if (this.isDisabled()) return;
            if (!this.clickable) return;
            (this.$refs.inputFile! as any).click();
        },

        dropped($e: any) {
            $e.preventDefault();
            if (!this.droppable) return;
            if (this.isDisabled()) return;

            const files : any[] = [];
            for(let i = 0; i < $e.dataTransfer.items.length; ++i) {
                const file = $e.dataTransfer.items[i].getAsFile();

                if (this.accept) {
                    const type = file.type;

                    const formats = this.accept.split(',').map((x: string) => x.trim());
                    const allowed = formats.includes(type) || formats.includes(type.split('/')[0] + '/*');
                    if (!allowed) continue;
                }

                files.push(file);
            }

            this.onfiles(files);
            this.$emit('drop', files);
        },

        fileSelected($e: any) {
            const files = $e.target.files;
            this.onfiles(files);
        },

        onfiles(files: any[]) {
            if (this.onDrop)
                this.onDrop(files);

            if (this.maxSize) {
                for(const file of files) {
                    const size = file.size / 1024 / 1024;

                    if (size > this.maxSize) {
                        this.$emit('size-exceeded', file);
                        return;
                    }
                }
            }

            this.$emit('update:modelValue', files.length > 0 ? files[0] : null);
            this.$emit('change', this.multiple ? files : (files.length > 0 ? files[0] : null));
            (this.$refs.inputFile as any).value = '';
        },

        clear() {
            (this.$refs.inputFile as any).value = '';
            this.$emit('update:modelValue', null);
            this.$emit('change', []);
        }
    }
});