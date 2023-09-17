<template>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon sprite-icons" :style="iconStyle()">
        <use :href="'/svg-icons/' + lib + '.svg#' + iconName" 
        :xlink:href="'/svg-icons/' + lib + '.svg#' + iconName"></use>
    </svg>
</template>

<script lang="ts" src="./svg-icon.ts"></script>
