<template>
    <AppGlobalWidgets />
    <component :is="getLayout()" :name="name" v-bind="{page: () => this}">
        <template v-if="loading">
            <component :is="loadscreenComponent" v-if="loadscreenComponent" />
            <loader v-else/>
        </template>
        <slot v-else :page="this"/>
    </component>
</template>

<script lang="ts" src="./app-page.ts"></script>