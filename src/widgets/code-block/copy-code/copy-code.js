
export default {
    name: "CopyCode",
    props: {
      content: {
        type: String,
      },
      width: {
        type: String,
        default: "20px",
      },
      height: {
        type: String,
        default: "20px",
      },
      color: {
        type: String,
        default: "#aaa",
      },
    },
    data() {
      return {
        message: "Copy code",
      };
    },
    methods: {
      selectContent() {
        let textArea = this.$refs.textarea;
        if (document.execCommand("copy") == true) {
          // older browser support
          let range, selection;
          textArea.focus();
          textArea.select();
          range = document.createRange();
          range.selectNodeContents(textArea);
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, textArea.value.length);
          document.execCommand("copy");
        } else {
          // modern browser support (using the clipboard API)
          navigator.clipboard.writeText(textArea.value);
        }
      },
      copy(event) {
        this.selectContent();
        event.target.focus();
        this.message = "Copied!";

        setTimeout(() => {
          this.resetMessage();
        }, 1000);
      },
      resetMessage() {
        this.message = "Copy code";
      },
    },
  };