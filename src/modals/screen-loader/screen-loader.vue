<template>
    <div>
        <loader :color="color"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: ['color']
});
</script>