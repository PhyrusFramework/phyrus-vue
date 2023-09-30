<template>
  <div
    class="code-block code_editor hljs"
    :class="{
      hide_header: withoutHeader,
      hide_language: !title && display_language === false && languageList.length < 2,
      scroll: canScroll,
      read_only: editable === false,
      wrap_code: wrap_code,
      atom_one_dark: theme == 'dark',
      atom_one_light: theme == 'light',
    }"
    :style="{
      width: width,
      height: height,
      borderRadius: border_radius,
      zIndex: z_index,
      maxWidth: max_width,
      minWidth: min_width,
      maxHeight: max_height,
      minHeight: min_height,
    }"
  >
    <div class="header" v-if="withoutHeader === true ? false : true">
      <div v-if="title" class="code-block-title" v-html="title"></div>
      <Dropdown
        :color="theme == 'dark' ? '#aaa' : '#999'"
        :width="selector_width"
        :mark="mark"
        :disabled="languageList.length < 2 ? true : false"
        v-if="display_language !== false || languageList.length > 1"
        :default_display="selector_displayed_by_default"
      >
        <ul class="lang_list" :style="{ height: selector_height }">
          <li
            v-for="(lang, index) in languageList"
            :key="index"
            @click="changeLang(lang)"
          >
            {{ lang[1] === undefined ? lang[0] : lang[1] }}
          </li>
        </ul>
      </Dropdown>
      <CopyCode
        width="16px"
        height="16px"
        :color="theme == 'dark' ? '#aaa' : '#999'"
        :content="content"
        v-if="copy_code"
      ></CopyCode>
    </div>
    <div
      class="code_area"
      :style="{
        borderBottomLeftRadius: border_radius,
        borderBottomRightRadius: border_radius,
        borderTopLeftRadius: withoutHeader == true ? border_radius : 0,
        borderTopRightRadius: withoutHeader == true ? border_radius : 0,
      }">

      <textarea
        v-if="editable === false ? false : modelValue === undefined ? true : false"
        ref="textarea"
        :autofocus="autofocus"
        @input="calcContainerWidth"
        @keydown.tab.prevent.stop="tab"
        @change="passEmit('blur')"
        v-on:scroll="scroll"
        v-model="staticValue"
        :style="{ fontSize: font_size }"
        spellcheck="false"/>

      <textarea
        v-if="editable === false ? false : modelValue === undefined ? false : true"
        ref="textarea"
        :autofocus="autofocus"
        @keydown.tab.prevent.stop="tab"
        v-on:scroll="scroll"
        :value="modelValue"
        @input="
          $emit('update:modelValue', $event.target.value),
            calcContainerWidth($event)
        "
        :style="{ fontSize: font_size }" />

      <pre :style="{ width: ''/*containerWidth === 0 ? '' : containerWidth + 'px'*/ }">
        <code
            v-highlight="contentValue"
            :class="languageClass"
            :style="{ top: top + 'px', left: left + 'px', fontSize: font_size, borderBottomLeftRadius: editable === false ? border_radius : 0, borderBottomRightRadius: !editable ? border_radius : 0 }"
        />
      </pre>
    </div>
  </div>
</template>

<script src="./code-block.js"></script>
<style lang="scss" src="./code-block.scss"></style>
