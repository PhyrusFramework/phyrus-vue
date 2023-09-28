<template>
    <div id="cookie-consent-dialog">
        <div class="flex-row">
            <h2 class="flex-grow" v-html="$t('cookies.configure')"/>
        </div>

        <p v-html="$t('cookies.dialog')"/>
        <br>

        <p v-html="$t('cookies.required')" />
        <p class="always">{{ $t('cookies.always') }}</p>
        <br><br>

        <div v-for="type of types" :key="type.id" class="flex-row gap10">
            <InputSwitch v-model="type.accepted"/>
            <div><b v-html="type.name"/>: <span v-html="type.description"/></div>
        </div>

        <div class="flex-row gap10 buttons">
            <div class="flex-grow"/>

            <btn @click="reject()">{{ $t('cookies.all.reject') }}</btn>
            <btn @click="accept()">{{ $t('cookies.all.selection') }}</btn>
            <btn @click="all()">{{ $t('cookies.all.accept') }}</btn>
        </div>
    </div>
</template>

<script lang="ts" src="./cookie-dialog.ts"></script>
<style lang="scss" src="./cookie-dialog.scss"></style>