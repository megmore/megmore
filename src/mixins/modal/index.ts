import { Component, Emit, Inject, Model, Prop, Provide, Vue, Watch } from 'vue-property-decorator'
import manage from './modalManage'
import { getZIndex } from '@/util'
// You can declare a mixin as the same style as components.
@Component
export default class ModalMixin extends Vue {
  @Prop({
    default: true,
  })
  public show!: boolean

  @Prop({
    default: false,
  })
  public fullscreen!: boolean

  @Prop({
    default: true,
  })
  public escPressClose!: boolean

  public domExist = false//  添加或移除BODY层dom
  public selfShow: boolean = false

  protected overlayZIndex = getZIndex()

  protected zIndex = getZIndex()

  get _value(): boolean {
    return this.show
  }
  set _value(val: boolean) {
    this.selfShow = val
    this.$emit('update:show', val)
  }

  get dom(): HTMLElement {
    return this.$el
  }
  public hide() {
    this._value = false
  }
  public afterLeave() {
    this.domExist = false
  }
  public resetZIndex() {
    this.zIndex = getZIndex()
  }
  public async setZIndex() {
    await this.$nextTick()
    const dom = this.$el
    this.zIndex = getZIndex()
    if (dom && dom.style) {
      dom.style.zIndex = String(this.zIndex)
    }
  }
  public escPress() {
    if (!this.escPressClose || !this.selfShow) {
      return
    }
    this._value = false
  }
  protected beforeDestroy() {
    this.domExist = false
  }
  private async mounted() {
    document.body.appendChild(this.$el)
  }
  private created() {
    this.selfShow = this._value
  }
  @Watch('_value')
  private visibleChangeHandle(val: boolean, oldVal: boolean) {
    this._value = val
    if (val) {
      this.domExist = val
      this.setZIndex()
      manage.open(this)
    } else {
      manage.close(this)
    }
  }
}
