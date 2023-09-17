
import { defineComponent, PropType } from 'vue';
import Loader from '../loader/loader.vue';
import Table, { TableColumn } from './table';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';

export default defineComponent({

    components: { Loader, DataTable, Column, Paginator },

    props: {
        table: {
            type: Object as PropType<Table>
        }
    },

    data() {
        const data : {
            oldTable : null | Table,
            loading: boolean,
            paginatorFirst: number,
            lockedHeight: string
        } = {
            oldTable: null,
            loading: false,
            paginatorFirst: 0,
            lockedHeight: ''
        }
        return data;
    },

    mounted() {
        if (this.table) {
            this.updateReference();
        }
    },

    methods: {
        updateReference() {
            if (!this.table) return;
            this.table.setReference(this);
            this.oldTable = this.table;
            this.table.refresh();
        },
        exportCSV() {
            const t = this.ref('tableRef');
            if (!t) return;
            t.exportCSV();
        },
        onRowReorder($event: any) {
            if (!this.table) return;
            if (!this.table.items) return;

            const s = $event.dragIndex;
            const e = $event.dropIndex;

            if (s == e) return;

            const item = this.table.items.splice(s, 1)[0];

            this.table.items.splice(
                e,
                0,
                item
            )

            this.table!._draggable!({
                from: s, to: e
            });
        },

        columnClass(col: TableColumn) {
            const obj : any = {}

            if (col.overflow == 'dots') {
                obj['text-ellipsis'] = true;
            }

            if (col.class) {
                obj[col.class] = true;
            }

            return obj;
        },

        columnStyle(col: TableColumn) {
            const obj : any = {}

            if (col.width) {
                obj['width'] = col.width + 'px';
                obj['min-width'] = col.width + 'px';
            }

            if (col.overflow && col.overflow != 'none') {
                if (col.overflow == 'hidden') {
                    obj['overflow'] = 'hidden';
                }
                else if (col.overflow == 'scroll') {
                    obj['overflow'] = 'auto';
                }
                if (col.width) obj['max-width'] = col.width + 'px';
            }

            return obj;
        },

        onPageChange($e: any) {
            this.table!._paginator.perPage = $e.rows;
            this.table!.page = $e.page + 1;
            this.table!.refresh();
        },
        lockTableHeight() {
            const ref = this.ref('tableRef');
            if (!ref) return;

            const h = ref.$el.clientHeight;
            this.lockedHeight = (h * 1.12) + 'px';
        },
        unlockTableHeight() {
            this.lockedHeight = '';
        }
    },

    updated() {
        if (!this.table) return;
        if (this.table == this.oldTable) return;
        this.updateReference();
    }

})