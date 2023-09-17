<template>
  <div
    class="copy_code"
    @click="copy"
    @focusout="resetMessage"
    tabindex="0"
    :style="{ width: width, height: height }"
  >
    <div class="tooltip">{{ message }}</div>
    <textarea ref="textarea" :value="content" tabindex="1" readonly></textarea>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-copy"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  </div>
</template>

<script src="./copy-code.js"></script>

<style scoped src="./copy-code.css"></style>