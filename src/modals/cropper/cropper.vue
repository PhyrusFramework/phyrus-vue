<template>
    <div class="crop-image-modal">
        <cropper @change="cropperChange($event)" v-if="src" :src="src" :stencil-props="stencilProp" />
        <div class="flex-row flex-center controls">
            <btn class="cancel-button" @click="cancel()">{{ $t('generic.cancel') }}</btn>
            <btn class="crop-button" @click="crop()">{{ $t('media.crop') }}</btn>
        </div>
    </div>
</template>

<style lang="scss" src="./cropper.scss"></style>

<script lang="ts" src="./cropper.ts"></script>