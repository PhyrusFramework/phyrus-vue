<template>
    <div>
        <div class="flex-row">
            <h2 class="flex-grow">{{ $t('cookies.configure') }}</h2>

            <close-x @click="closeModal()"/>
        </div>

        <p>{{ $t('cookies.dialog') }}</p>

        <p v-html="$t('cookies.required')" />
        <p class="always">{{ $t('cookies.always') }}</p>

        <div v-for="type of types" :key="type.id">
            <p><b>{{type.name}}</b>: {{type.description}}</p>

            <!-- TODO <toggle v-model="type.accepted" size="medium"
            activeColor="white"
            inactiveColor="white"
            activeBackgroundColor="var(--primary-color)"
            inactiveBackgroundColor="gray" /> -->
        </div>

        <div class="flex-row buttons">
            <div class="flex-grow"/>

            <btn @click="reject()">{{ $t('cookies.all.reject') }}</btn>
            <btn @click="accept()">{{ $t('cookies.all.selection') }}</btn>
            <btn @click="all()">{{ $t('cookies.all.accept') }}</btn>
        </div>
    </div>
</template>

<script lang="ts" src="./cookie-dialog.ts"></script>
<style lang="scss" src="./cookie-dialog.scss"></style>