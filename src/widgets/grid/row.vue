<template>
    <div class="row" :class="{'row-padding': space !== undefined}"><slot/></div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: ['space']
})
</script>
