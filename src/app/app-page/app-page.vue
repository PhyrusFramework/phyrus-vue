<template>
    <AppGlobalWidgets />
    <component :is="getLayout()" :id="$attrs.id" :page="this">
        <template v-if="loading">
            <component :is="loadscreenComponent" v-if="loadscreenComponent" />
            <loader v-else/>
        </template>
        <slot v-else :page="this"/>
    </component>
</template>

<script lang="ts" src="./app-page.ts"></script>
<style lang="scss" src="./app-page.scss"></style>