<template>
    <form class="app-form row row-padding" v-if="_fields">

        <div v-for="(field, index) in _fields" :key="field.name ? field.name : ('field_'+index)" 
        class="app-form-column"
        :class="columnClasses(field)">

            <p v-html="field.label" v-if="field.type == 'label'"/>

            <form-input v-else-if="!field.component && !field.submit && field.model"
            v-model="field.model[field.name]" 
            :type="field.type" 
            :inputId="field.name"
            :label="fieldLabel(field)"
            v-bind="field.props ? field.props : {}"
            :invalid="() => !!field.error"
            :help="field.error ? field.error : undefined"/>

            <component v-else-if="field.component"
            :is="field.component"
            v-bind="field.props"/>

            <btn class="submit" v-else-if="field.submit" @click="submit($event, field)" v-bind="field.props">{{ field.label }}</btn>

        </div>

    </form>
</template>

<script lang="ts" src="./app-form.ts"></script>
<style lang="scss" src="./app-form.scss"></style>