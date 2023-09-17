
import hljs from "highlight.js";
import Dropdown from "./dropdown/dropdown.vue";
import CopyCode from "./copy-code/copy-code.vue";

export default {
  components: {
    Dropdown,
    CopyCode,
  },
  name: "CodeEditor",
  props: {
    modelValue: {
      type: String,
    },
    wrap_code: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    hide_header: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "540px",
    },
    height: {
      type: String,
      default: "auto",
    },
    max_width: {
      type: String,
    },
    min_width: {
      type: String,
    },
    max_height: {
      type: String,
    },
    min_height: {
      type: String,
    },
    border_radius: {
      type: String,
      default: "12px",
    },
    languages: {
      type: Array
    },
    language: {
      type: String,
      default: 'javascript'
    },
    selector_width: {
      type: String,
      default: "110px",
    },
    selector_height: {
      type: String,
      default: "auto",
    },
    selector_displayed_by_default: {
      type: Boolean,
      default: false,
    },
    display_language: {
      type: Boolean,
      default: false,
    },
    copy_code: {
      type: Boolean,
      default: true,
    },
    z_index: {
      type: String,
    },
    font_size: {
      type: String,
      default: "17px",
    },
    theme: {
      type: String,
      default: "dark",
    },
    title: {
      type: String
    }
  },
  directives: {
    highlight: {
      //vue2
      bind(el, binding) {
        el.textContent = binding.value
        hljs.highlightElement(el)
      },
      componentUpdated(el, binding) {
        el.textContent = binding.value
        hljs.highlightElement(el)
      },
      //vue3
      created(el, binding) {
        el.textContent = binding.value
        hljs.highlightElement(el)
      },
      updated(el, binding) {
        el.textContent = binding.value
        hljs.highlightElement(el)
      }
    }
  },
  data() {

    const langs = [];
    if (this.languages) {
      for(const l of this.languages) {
        langs.push([l, l]);
      }
    }

    if (!this.languages || !this.languages.includes(this.language)) {
      langs.unshift([this.language, this.language]);
    }

    return {
      containerWidth: 0,
      staticValue: this.value,
      top: 0,
      left: 0,
      languageClass: 'hljs language-' + this.language,
      mark: this.language,
      languageList: langs,
      content:
        this.modelValue === undefined ? this.staticValue : this.modelValue,
    };
  },
  watch: {
    value(value) {
      this.staticValue = value
    }
  },
  computed: {
    contentValue() {
      return this.editable === false ?
        this.value : this.modelValue === undefined ?
        this.staticValue + '\n' : this.modelValue + '\n'
    },
    canScroll() {
      return this.height == "auto" ? false : true;
    },
    withoutHeader() {
      if (this.hide_header == true) {
        return true;
      } else {
        return !this.title && this.display_language !== false && this.copy_code == false
          ? true
          : false;
      }
    },
  },
  methods: {
    passEmit(e, $e = null) {
      this.$emit(e, $e);
    },
    changeLang(lang) {
      this.mark = lang[1] === undefined ? lang[0] : lang[1];
      this.languageClass = 'language-' + lang[0];
      this.$emit('lang', lang[0]);
    },
    calcContainerWidth(event) {
      //  calculating the textarea's width while typing for syncing the width between textarea and highlight area
      this.containerWidth = event.target.clientWidth;
    },
    tab() {
      document.execCommand("insertText", false, "    ");
    },
    scroll(event) {
      this.top = -event.target.scrollTop;
      this.left = -event.target.scrollLeft;
    },
    resize(){
      // listen to the change of the textarea's width to resize the highlight area
      const resize = new ResizeObserver(entries => {
        for (let entry of entries) {
            const obj = entry.contentRect;
            this.containerWidth = obj.width + 40  // 40 is the padding
        }
      });
      // only the textarea is rendered the listener will run
      if(this.$refs.textarea){
        resize.observe(this.$refs.textarea);
      }
    }
  },
  mounted() {

    let langs = undefined;
    if (this.languages) {
      langs = [];
      for(const l of this.languages) {
        langs.push([l, l]);
      }

      if (!this.languages.includes(this.language)) {
        langs.unshift([this.language, this.language]);
      }
    }

    this.$emit('lang', this.language);
    this.$emit('langs', langs);
    this.$nextTick(function () { 
      this.content =
        this.modelValue === undefined ? this.staticValue : this.modelValue;
    });
    this.resize()
  },
  updated() {
    this.$emit('input', this.staticValue)
    this.$nextTick(function () {
      this.content =
        this.modelValue === undefined ? this.staticValue : this.modelValue;
    });
  },
};