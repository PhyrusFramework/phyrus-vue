
export default {
    name: "Dropdown",
    props: {
      width: {
        type: String,
        default: "80px",
      },
      height: {
        type: String,
        default: "auto",
      },
      mark: {
        type: String,
        default: "",
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      color: {
        type: String,
        default: "#aaa",
      },
      default_display: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        show: this.default_display,
      };
    },
    computed: {
      showArrow() {
        return this.disabled == true ? false : true;
      },
    },
    methods: {
      toggleDropdown() {
        if (this.disabled == false) {
          this.show == true ? (this.show = false) : (this.show = true);
        }
      },
      hideDropdown() {
        this.show = false;
      },
    },
  };