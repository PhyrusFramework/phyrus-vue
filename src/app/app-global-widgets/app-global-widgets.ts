import { defineComponent } from 'vue';
import Drawer from '../drawer/drawer.vue';
import AppModal from '../app-modal/app-modal.vue';
import App from '../../modules/app';
import CookieConsent from '../cookie-consent/cookie-consent.vue';
import AppNotifications from '../app-notifications/app-notifications.vue';

export default defineComponent({
  components: { Drawer, AppModal, CookieConsent, AppNotifications },

  mounted() {
    App.drawer.setReference(this.$refs.appDrawer);
    App.notifications.setReference(this.$refs.appNotifications);
    App.modal.setReference(this.$refs.appModal);
    App.cookieConsent.setReference(this.$refs.cookieConsent);
  }
});