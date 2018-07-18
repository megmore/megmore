import Vue, {RenderContext, VNode, VueConstructor} from "vue"


export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'// 尺寸
export type Type = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'default'//  颜色主题类型

export type Color = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'default' | string //  颜色主题类型
export type Variety = 'normal' | 'flat' | 'outline' |  'pure' //  类型变异
export type Shape = 'square' | 'corner' | 'round' | 'circle' //  形状

// date
export type DateValueType = 'timestamp' | 'date'  //  形状
export type DatePickerType = 'year' | 'month' | 'week' | 'date' | 'time'  | 'datetime'
export type FirstDayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface ModalComponent extends Vue {// 模态框组件
    escPress: () => void,
    show: boolean,
    _value: boolean,
    visible: boolean
}
export interface Component extends Vue {//  普通组件
    install: (Vue: VueConstructor) => void
}
export interface Render {
    (h: () => VNode, context: RenderContext): VNode
}
export interface ConfirmOptions {
    title?: string,
    content?: string | Render,
    type?: Color
}