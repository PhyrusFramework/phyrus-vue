import Utils from "../../modules/utils";
import translate from "../../modules/translator";
import PaginatorStructure from "./paginator-structure";

export type TableColumn = {
    header: string,
    name: string,
    value?: (item: any) => string,
    component?: any,
    props?: (item: any) => any,
    width?: number,
    overflow?: 'none'|'hidden'|'dots'|'scroll',
    sortable?: boolean,
    class?: string,
    fixed?: boolean
}

export default class Table {

    static create() {
        return new Table();
    }

    _ref: any = null;
    setReference(ref: any) {
        this._ref = ref;
    }

    _striped: boolean = false;
    static striped() : Table {
        const t = new Table();
        t._striped = true;
        return t;
    }

    items: null|any[] = null;

    columns: TableColumn[] = [];
    setColumns(columns: TableColumn[]) : Table {
        this.columns = columns;
        return this;
    }

    page: number = 1;
    sort?: {
        by: string,
        order: number
    };

    get perPage() : number {
        if (!this._paginator) return 10;
        return this._paginator.perPage;
    }
    set perPage(value: number) {
        if (!this._paginator) return;
        this._paginator.perPage = value;
    }

    _handleSort($e: any) {
        this.sort = $e.sortField ? {
            by: $e.sortField,
            order: $e.sortOrder
        } : undefined
        this.refresh();
    }
    sortedBy(field: string, dir: number = 1) : Table {
        this.sort = {
            by: field,
            order: dir
        }
        return this;
    }

    _fetch?: () => Promise<any[]>;
    fetch(action: (table: Table) => Promise<any[]>) : Table {
        this._fetch = () => new Promise((resolve, reject) => {

            const emptyMessage = this.emptyMessage;

            if (this._ref) {
                this._ref.loading = true;
                this.emptyMessage = '';
                this.items = [];
                this._ref.lockTableHeight();
            }

            if (this.stateType == 'url') {
                if (!this._originalState) {
                    this.getOriginalState();
                }
                this.updateURLState();
            }    

            action(this)
            .then(response => {

                if (this._ref) {
                    this._ref.loading = false;
                    this.emptyMessage = emptyMessage;
                    this._ref.unlockTableHeight();
                }
                resolve(response);
            })
            .catch(reject)
        })
        return this;
    }

    _draggable?: ($e: {from: number, to: number}) => void
    draggable(onDrag: ($e: {from: number, to: number}) => void) : Table {
        this._draggable = onDrag;
        return this;
    }

    _gridlines: boolean = false;
    gridlines() : Table {
        this._gridlines = true;
        return this;
    }

    _resizeColumns?: 'fit'|'expand';
    resizeColumns(mode: 'fit'|'expand' = 'fit') : Table {
        this._resizeColumns = mode;
        return this;
    }

    emptyMessage: string = translate.get('table.empty');
    setEmptyMessage(message: string) : Table { 
        this.emptyMessage = message;
        return this;
    }

    selectedItems: any = [];

    isSelected(item: any) : boolean {
        return this.selectedItems.includes(item);
    }

    _selectable?: 'single'|'multiple'|'checkbox'|'radio';
    _selectedListener?: ( listener: ($e: any) => void, selected: boolean ) => void

    selectableRows(type: 'single'|'multiple'|'checkbox'|'radio',
        listener: ($e: any) => void) : Table {

        this._selectedListener = ($e: any, selected: boolean) => {
            $e['selected'] = selected;
            listener($e);
        };
        this._selectable = type;
        return this;
    }

    _lockedItems : any = [];
    setLockedItems(items: any[]) : Table {
        this._lockedItems = items;
        return this;
    }

    _expandedRows: any[] = [];
    _expansion?: {html: boolean, component: any, props?: (item: any) => any}
    setExpansion(component: any, props?: (item: any) => any) : Table {
        this._expansion = {
            html: typeof(component) == 'function' ? true : false,
            component,
            props
        }
        return this;
    }
    expand(items: any) : Table {
        this._expandedRows = items;
        return this;
    }
    expandAll() : Table {
        const e = [];
        if (this.items) {
            for(const item of this.items) {
                e.push(item);
            }
        }
        this._expandedRows = e;
        return this;
    }
    collapseAll() : Table {
        this._expandedRows = [];
        return this;
    }

    _paginator : any = null;
    pagination(paginator: {
        perPage?: number,
        totalResults?: number
    }) : Table {
        this._paginator = {
            perPage: paginator.perPage ? paginator.perPage : (this._paginator ? this._paginator.perPage : 10),
            totalResults: paginator.totalResults ? paginator.totalResults : (this._paginator ? this._paginator.totalResults : 10),
            structure: this._paginator ? this._paginator.structure : new PaginatorStructure()
        };
        return this;
    }

    paginator(structure: PaginatorStructure) {
        if (!this._paginator) {
            this._paginator = {
                structure: structure,
                perPage: 1,
                totalResults: 0
            }
        }

        this._paginator.structure = structure;
    }

    stateType?: 'session'|'storage'|'url';
    stateKey?: string;
    useState(type: 'session'|'storage'|'url', key: string = 'table-session') : Table {
        this.stateType = type;
        this.stateKey = key;
        return this;
    }

    private _originalState: any = null
    private _currentState: any = {}
    private getOriginalState() {

        // Save default values
        this._originalState = {
            page: this.page,
            sortBy: this.sort ? this.sort.by : undefined,
            sortOrder: this.sort ? this.sort.order : 1,
            perPage: this.perPage
        }

        // But now get values from URL
        const q = Utils.queryParams();
        
        if (q.sortBy) {
            const by = q.sortBy;
            const dir = q.sortOrder ? Number(q.sortOrder) : 1;
            this.sort = {
                by,
                order: dir
            }
        }
        if (q.perPage) this.perPage = Number(q.perPage);
        if (q.page) {
            this.page = Number(q.page);
            if (this._ref) {
                this._ref.paginatorFirst = (this.page - 1) * this.perPage;
            }
        }

    }
    private updateURLState() {

        this._currentState['page'] = this.page;
        this._currentState['sortBy'] = this.sort ? this.sort.by : undefined;
        this._currentState['sortOrder'] = this.sort ? this.sort.order : 1;
        this._currentState['perPage'] = this.perPage;

        const q = Utils.queryParams();

        Object.keys(this._currentState).forEach((k: string) => {
            if (this._currentState[k] && this._currentState[k] != this._originalState[k]) {
                q[k] = this._currentState[k];
            } else if (q[k]) {
                if (!this._currentState[k]) {
                    delete this._currentState[k];
                }
                delete q[k];
            }
        });

        Utils.setQueryParams(q);

    }

    setStateFilters(filters: any) : Table {

        const keep = ['page', 'sortBy', 'sortOrder', 'perPage'];

        const filtersKeys = Object.keys(filters);

        filtersKeys.forEach((k: string) => {
            this._currentState[k] = filters[k];
        })

        // Now remove filters that were in _currentState but are not in "filters"
        Object.keys(this._currentState)
        .forEach((k: string) => {
            if (keep.includes(k)) return;

            if (!filtersKeys.includes(k)) {
                delete this._currentState[k];
            }
        });

        this.updateURLState();

        return this;
    }

    refresh() : Table {
        if (!this._fetch) return this;

        this._fetch()
        .then(items => {
            this.items = items;
            this.pagination({})
        }).catch(err => {
            console.log("Error fetching table items:", err);
        })

        return this;
    }

    exportCSV() {
        if (!this._ref) return;
        this._ref.exportCSV()
    }

}