import { defineComponent, PropType } from 'vue';
import Loader from '../loader/loader.vue';

export default defineComponent({

    components: {Loader},

    props: {
        onLoadMore: {
            type: Function as PropType<(e: {stop: (finished?: boolean) => void}) => Promise<any[]>>
        },
        threshold: {
            type: Number
        },
        list: {
            type: Object as PropType<any[]>
        },
        emptyMessage: {
            type: String
        },
        reverse: {
            type: Boolean
        },
        scroller: {
            type: HTMLElement
        }
    },

    data() {
        const data : {
            loading: boolean,
            finished: boolean,
            scrollPosition: number
        } = {
            loading: false,
            finished: false,
            scrollPosition: 0
        }

        return data;
    },

    created() {
        this.load();

        window.addEventListener('scroll', () => {
            this.handleScroll(null);
        });
    },

    methods: {

        scrollTo(position: number) {
            (this.$refs.container as any).scrollTop = position;
        },

        el() : any {
            return this.scroller ? this.scroller : (window as any);
        },

        detectScroll() {

            const e = this.el();

            let position = 0;
            if (this.scroller) {
                position = e.scrollTop + e.clientHeight;
            } else {
                position = e.scrollY + e.innerHeight;
            }
            
            const mark = (this.$refs.mark as any);
            const container = (this.$refs.container as any);
            if (!container) return;
            const threshold = this.threshold ? this.threshold : 50;

            this.scrollPosition = container.scrollTop;
            this.$emit('scrolling', this.scrollPosition);

            if (!this.reverse) {
                if (position + container.scrollTop >= mark.offsetTop - threshold) {
                    return true;
                }
            } else {
                if (container.scrollTop <= mark.offsetTop + threshold) {
                    return true;
                }
            }

            return false;

        },

        handleScroll(e:any) {

            if (!this.onLoadMore) return;
            if (this.loading) return;
            if (this.finished) return;

            // New method
            if (this.detectScroll()) {
                this.load();
            }

            // Old method
            /*if (Utils.scrollBottomReached(e, this.threshold)) {
                this.load();
            }*/

        },

        reset() {
            this.loading = false;
            this.finished = false;
            this.load();
        },

        load() {
            if (!this.onLoadMore) {
                console.log("Infinite Scroll needs an onLoadMore function");
                return;
            }

            this.loading = true;

            this.onLoadMore({
                stop: (finish: boolean = false) => {
                    this.loading = false;
                    this.finished = finish;
                }
            });
        }
    }

});