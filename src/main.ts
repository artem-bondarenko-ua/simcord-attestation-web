import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"
import "normalize.css"
import '@/theme/global.css'

createApp(App)
  .use(router)
  .component("VueDatePicker", VueDatePicker)
  .mount("#app")
