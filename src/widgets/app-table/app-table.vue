<template>
    <div class="app-table">

        <loader v-if="!table || !table.items"/>

        <template v-else>

            <DataTable :value="table.items" tableStyle="min-width: 50rem" ref="tableRef" scrollable
            :stripedRows="table._striped" :onRowReorder="onRowReorder" :showGridlines="table._gridlines"
            @sort="table._handleSort($event)" removableSort :sortField="table.sort ? table.sort.by : null" 
            :sortOrder="table.sort ? table.sort.order : null" :loading="loading"
            v-model:selection="table.selectedItems" :style="{height: lockedHeight}"
            :stateStorage="(table.stateType && table.stateType != 'url') ? table.stateType : undefined" 
            :stateKey="(table.stateKey && table.stateType != 'url') ? table.stateKey : undefined"
            :resizableColumns="table._resizeColumns ? true : false" :columnResizeMode="table._resizeColumns"
            :frozenValue="table._lockedItems.length > 0 ? table._lockedItems : undefined"
            v-model:expandedRows="table._expandedRows" 
            :selectionMode="table._selectable && ['single', 'multiple'].includes(table._selectable) ? table._selectable : undefined" 
            :metaKeySelection="false"
            @rowSelect="table._selectedListener($event, true)" @rowUnselect="table._selectedListener($event, false)">

                <template #empty v-if="table.emptyMessage">{{table.emptyMessage}}</template>

                <template #loading><loader/></template>

                <Column :selectionMode="table._selectable == 'radio' ? 'single' : 'multiple'" 
                headerStyle="width: 3rem" v-if="['checkbox', 'radio'].includes(table._selectable)"></Column>

                <Column :rowReorder="true" :class="'dragIconColumn'"  
                :frozen="true" :exportable="false" header="" v-if="table._draggable"></Column>

                <Column expander style="width: 3rem" v-if="table._expansion" />

                <Column v-for="(col, index) in table.columns" :key="col.name"
                :field="col.name"
                :class="columnClass(col)"
                :style="columnStyle(col)"
                :sortable="col.sortable"
                :frozen="col.fixed"
                :alignFrozen="index >= table.columns.length - 1 ? 'right' : 'left'"
                :header="col.header ? col.header : ''">
                    <template #body="slotProps">
                        <div v-if="col.value" v-html="col.value(slotProps.data)"/>
                        <component v-if="col.component" :is="col.component" v-bind="col.props ? col.props(slotProps.data) : {}"/>
                    </template>
                </Column>

                <template #expansion="slotProps" v-if="table._expansion">
                    <div v-if="table._expansion.html" v-html="table._expansion.component(slotProps.data)" />
                    <component v-else :is="table._expansion.component" 
                    v-bind="table._expansion.props ? table._expansion.props(slotProps.data) : {}" />
                </template>

            </DataTable>

            <Paginator v-if="table._paginator && 
                table.items && table.items.length 
                && table._paginator.totalResults > table._paginator.perPage" 
            v-model:first="paginatorFirst"
            :rows="table._paginator.perPage" :totalRecords="table._paginator.totalResults"
            :template="table._paginator.structure.toString()"
            :rowsPerPageOptions="table._paginator.structure.perPageOptions"
            @page="onPageChange($event)" :currentPageReportTemplate="table._paginator.structure.textTemplate"/>

        </template>

    </div>
</template>

<script lang="ts" src="./app-table.ts"></script>
<style lang="scss" src="./app-table.scss"></style>