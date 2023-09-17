<template>
    <div id="cookie-consent-banner" v-if="!cookiesAnswered">

        <h3>{{ $t('cookies.title') }}</h3>

        <p>{{ $t('cookies.text') }}</p>

        <div class="flex-row bottom">
            <div class="flex-grow" />

            <btn class="plain" v-if="types.length > 0"
            @click="configure()">{{ $t('cookies.configure') }}</btn>
            <btn class="plain" @click="reject()">{{ $t('cookies.reject') }}</btn>
            <btn @click="accept()">{{ $t('cookies.accept') }}</btn>
        </div>

    </div>
</template>

<script lang="ts" src="./cookie-consent.ts"></script>
<style lang="scss" src="./cookie-consent.scss"></style>