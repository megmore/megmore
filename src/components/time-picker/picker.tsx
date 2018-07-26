import { Component, Prop, Emit, Model, Provide, Vue } from 'vue-property-decorator'
import {Color, DatePickerType} from "@/types/model"
import { mixins } from 'vue-class-component'
import TimePickerBase from './mixins/base'
import MTimePickerHeader from './components/header'
import MTimePickerPanelDate from './components/panel-date'
import MTimePickerPanelYear from './components/panel-year'
import MTimePickerPanelMonth from './components/panel-month'
import MTimePickerPanelTime from './components/panel-time'
import MTimePickerHandler from './components/handler'
import { VNode } from 'vue'

const prefix = 'm-time-picker'

@Component({ components: {
        MTimePickerHeader,
        MTimePickerPanelDate,
        MTimePickerPanelYear,
        MTimePickerPanelMonth,
        MTimePickerPanelTime,
        MTimePickerHandler,
}})
export default class MTimePicker extends mixins(TimePickerBase) {

    @Prop({ type: String, default: 'primary' })
    private type!: Color

    @Prop({ type: Number, default: 2 })
    private elevation!: number

    @Prop({ type: Boolean, default: false })
    private landscope!: boolean

    @Prop({ type: String, default: 'list' })
    private timeSelectType!: 'list' | 'clock'

    get classes(): any {
        return{
            [`m--elevation-${this.elevation}`]: this.elevation,
            [`m--landscope`]: this.landscope,
            [`m--confirm`]: this.confirm,
        }
    }

    public handleActive(type: DatePickerType){
        if(['datetime', 'date'].includes(this.pickerType)){
            this.DateStore.SET_ACTIVE_TYPE(type)
        }
    }

    public render(): VNode {
        const { classes, type, firstDayOfWeek, max, min, handleActive, confirm } = this
        const { activeType, pickerType } = this.DateStore

        const RPanel = ()=> {
            switch (activeType) {
                case 'date':  return <MTimePickerPanelDate max={max} min={min} firstDayOfWeek={firstDayOfWeek} type={type} />;
                case 'year':  return <MTimePickerPanelYear onPick={()=>{handleActive('date')}} max={max} min={min} />;
                case 'month': return <MTimePickerPanelMonth onPick={()=>{handleActive('date')}} />;
                default:  return <MTimePickerPanelTime onPick={()=>{handleActive('date')}} type={type} />;
            }
        }

        const RHandler =()=> {
            return confirm ? <MTimePickerHandler /> : ''
        }

        return (
            <div staticClass={`${prefix} m--${pickerType}`} class={classes}>
                <MTimePickerHeader type={type} />
                <transition>
                    <div class={`${prefix}__main`}>
                        <div class={`${prefix}__panel`}>{RPanel()}</div>
                        {RHandler()}
                    </div>
                </transition>
            </div>
        )
    }
}
