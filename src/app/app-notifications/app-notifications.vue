<template>
    <transition-group class="app-notifications" name="p-message" tag="div" v-if="notifications && notifications.length > 0">
        <Message v-for="notification of notifications" :key="notification.id" 
        class="notification"
        :class="classForElement(notification)"
        :severity="notification.type"
        :closable="notification.closable"
        @close="closeNotification(notification)">

            <template v-if="notification.text">
                <div v-html="notification.text" />
            </template>

            <component v-if="notification.component" :is="notification.component" v-bind="notification.props"/>
        </Message>
    </transition-group>
</template>

<script lang="ts" src="./app-notifications.ts"></script>
<style lang="scss" src="./app-notifications.scss"></style>