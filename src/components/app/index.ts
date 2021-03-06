import MApp from '@/components/app/app'
import { VueConstructor } from 'vue'

/* istanbul ignore next */
MApp.install = function install(Vue: VueConstructor) {
  Vue.component(MApp.name, MApp)
}

export default MApp
