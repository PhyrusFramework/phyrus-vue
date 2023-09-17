<template>
    <div id="app-modals">
        <Dialog v-for="(modal, index) in modals" :key="index" v-model:visible="modal.visible" :modal="modal.background"
        :header="modal.title" :breakpoints="modal.breakpoints" :draggable="modal.draggable" :position="modal.position"
        :maximizable="modal.maximizable"
        :class="classForModal(modal)" :style="{width: modal.width ? modal.width : ''}" @hide="completeClose(modal)"
        @maximize="modal.onMaximize(true)" @unmaximize="modal.onMaximize(false)">
            <div v-if="modal.html" v-html="modal.html" />
            <component v-if="modal.component" :is="modal.component" v-bind="modal.componentProps"/>

            <template v-if="modal.buttons.length > 0" #footer>
                <div class="p-dialog-footer-content">
                    <btn v-for="(btn, index) in modal.buttons" :key="index" @click="clickOnButton(modal, btn)"
                    :disabled="btn.disabled" :loading="btn.loading" :class="btn.class" :style="btn.style">
                        <svg-icon v-if="btn.icon && btn.iconPosition != 'right'" :name="btn.icon" />
                        <div>{{ btn.content }}</div>
                        <svg-icon v-if="btn.icon && btn.iconPosition == 'right'" :name="btn.icon" />
                    </btn>
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script lang="ts" src="./app-modal.ts"></script>
<style lang="scss" src="./app-modal.scss"></style>