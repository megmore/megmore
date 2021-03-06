import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { VNode } from 'vue'
import { mixins } from 'vue-class-component'
import modalMixin from '@/mixins/modal'
import Render from '@/components/base/render'
@Component
export default class MModal extends mixins(modalMixin) {
  public static options: any
  @Prop({
    default: '',
  })
  public title!: string  // 标题

  @Prop({
    default: '',
    type: [Object, String],
  })
  public content!: string | VNode // 内容，可为render函数
  @Prop({
    default: 600,
    type: [String, Number],
  })
  private width!: number | string

  @Prop({
    default: 50,
  })
  private top!: number  // 弹窗距离顶部高度


  get style() {
    const wType = typeof this.width
    return {
      [this.fullscreen ? '' : 'width']: wType === 'number' ? `${this.width}px` : this.width,
      top: `${this.fullscreen ? 0 : this.top}px`,
    }
  }

  get transitionName() {
    return this.fullscreen ? 'modal-fullscreen-transition' : 'modal-transition'
  }

  @Emit()
  public confirm() {
    this.hide()
  }
  @Emit()
  public cancel() {
    this.hide()
  }
  public render(h) {
    const contentClass = `${this.fullscreen ? 'full-screen' : ''}`
    const { content } = this
    return (
       (
        <transition name={this.transitionName} onBeforeEnter={this.beforeEnter} onAfterLeave={this.afterLeave}>
          <div staticClass='m-modal' v-show={this.visible} onClick={this.closeLastModal}>
            <div staticClass='m-modal__content' class={contentClass} style={this.style} onClick={this.eveStop}>
              <div class='m-modal__title'>
                {this.$slots.title || this.title}
              </div>
              <m-icon name='close' onClick={this.hide}>X</m-icon>
              <div class='m-modal__body'>
                {typeof content === 'function' ? (<Render content={content}></Render>) : this.$slots.default || this.content}
              </div>
              {this.$slots.footer || (
                <div class='m-modal__footer'>
                  <m-button onClick={this.cancel}>
                    取消
                  </m-button>
                  <m-button onClick={this.confirm}>
                    确认
                  </m-button>
                </div>
              )}
            </div>
          </div>
        </transition>
      )
    )
  }
}