import { Component, Prop, Emit, Vue, Inject } from 'vue-property-decorator'
import MIcon from '@/components/icon'
import { MTransitionExpansion } from '@/components/transition'
import MCheckbox from '@/components/checkbox'
import MRadio from '@/components/radio'
import { VNode, VNodeChildren } from 'vue'
import { toAbsStyleSize } from '@/utils/helpers'
import { on, off } from '@/utils/event'
import {Size} from "@/types/model"

const prefix = 'm-table-body'

@Component({ components: { MCheckbox, MRadio, MIcon, MTransitionExpansion }})
export default class TableBody extends Vue {
    @Prop({ type: String })
    private height!: string

    @Prop({ type: Boolean })
    private border!: boolean

    @Prop({ type: Boolean })
    private noHeader!: boolean

    @Prop({ type: String})
    private size!: Size

    @Prop({ type: Boolean })
    private rowSelect!: boolean

    @Prop({ type: Boolean })
    private rowExpand!: boolean

    @Prop({ type: String})
    private select!: 'none' | 'single' | 'multi'

    @Prop({ type: String})
    private expand!: 'none' | 'single' | 'multi'

    @Inject()
    private TableCols!: any

    @Inject()
    private TableStore!: any

    private get selectable(): boolean {
        return this.select !== 'none'
    }
    private get expandable(): boolean {
        return this.expand !== 'none'
    }
    private get styles(): any {
        const { height } = this

        return {
            height: height !== 'auto' ? height : false,
        }
    }

    private handleRowClick(row: any, index: number): void {
        const { selectable, rowSelect, expandable, rowExpand } = this

        if (selectable && rowSelect) {
            this.handleRowSelect(row, index)
        }
        if (expandable && rowExpand) {
            this.handleRowExpand(row, index)
        }
    }
    private handleRowSelect(row: any, index: number): void {
        this.TableStore.SET_SELECTED(index)
    }
    private handleRowExpand(row: any, index: number): void {
        console.log(index)
        this.TableStore.SET_EXPANDED(index)
    }
    private RCols(row: any, index: number): VNode {
        const { TableCols, selectable, select, size, expandable, handleRowSelect, handleRowExpand } = this
        const { Selected, keyField, NoSelect, Expanded } = this.TableStore


        const result: any = []

        const RContent = (
            item: any,
            isSelect: boolean = false,
            isExpand: boolean = false,
        ): VNode => {
            let content: any = []

            const scopedSlots = item.data.scopedSlots
            const field = item.componentOptions.propsData.field

            if (isSelect) {
                const isSelected = Selected.includes(row[keyField])

                if (select === 'multi') {
                    content = <div class="m--center">
                                <MCheckbox value={isSelected}
                                         size={size}
                                         nativeOnClick={(event: Event) => { event.stopPropagation()}}
                                         onInput={() => handleRowSelect(row, index)} />
                              </div>
                } else {
                    content = <div class="m--center">
                                <MRadio value={isSelected}
                                      size={size}
                                      nativeOnClick={(event: Event) => { event.stopPropagation()}}
                                      onInput={() => handleRowSelect(row, index)} />
                              </div>
                }
            } else if (isExpand) {
                const isExpanded = Expanded.includes(row[keyField])
                    content = <div class="m--center"
                                onClick={(event: Event) => {
                                event.stopPropagation()
                                handleRowExpand(row, index)
                            }}>
                            <transition name="m-transition-scale">
                                { isExpanded
                                ? <MIcon name='remove' size={size} />
                                : <MIcon name='add' size={size}/>
                                }
                            </transition>
                          </div>
            } else if (scopedSlots) {
                // 自定模板
                content = scopedSlots.default(row)
            } else {
                content = row[field]
            }

            return content
        }

        const RCell = (item: any): VNode => {
            const width = toAbsStyleSize(
                item.componentOptions.propsData.width,
            )

            const styles = {
                width,
                minWidth: width,
                maxWidth: width,
            }
            const align = item.componentOptions.align
                || item.componentOptions.Ctor.options.props.align.default

            const type = item.componentOptions.propsData.type
            const isSelect = (type === 'select' && selectable)
            const isExpand = (type === 'expand' && expandable)

            return <td staticClass={`${prefix}__cell`}
                       style={styles}
                       align={align}>
                      {RContent(item, isSelect, isExpand)}
                   </td>
        }

        TableCols.forEach((item: any) => { result.push(RCell(item)) })

        return result
    }
    private RRow(row: any, index: number): VNode {
        const { TableStore, RCols, handleRowClick, selectable } = this
        const { Selected, keyField, NoSelect } = TableStore

        const classes = selectable ? {
            'm--selected': Selected.includes(row[keyField]),
            'm--disabled': NoSelect.includes(row[keyField]),
        } : {}

        return  <tr staticClass={`${prefix}__row`}
                    class={classes}
                    onClick={() => handleRowClick(row, index)}>
                    {RCols(row, index)}
                </tr>
    }
    private RExpand(row: any, index: number): VNode | undefined {
        if (!this.$parent.$scopedSlots.expand) { return undefined }

        const { TableStore, TableCols, expandable } = this
        const { Expanded, keyField } = TableStore

        if (!expandable) { return undefined }

        const isExpanded = Expanded.includes(row[keyField])

        return <tr staticClass={`${prefix}__expand`}>
                    <td colSpan={TableCols.length}>
                        <MTransitionExpansion>
                            { isExpanded
                                ? <div staticClass={`${prefix}__expand-content`}>
                                    { this.$parent.$scopedSlots.expand(row) }
                                  </div>
                                : undefined
                            }
                        </MTransitionExpansion>
                    </td>
               </tr>
    }
    private RTBody(): VNode {
        const { TableStore, RRow, RExpand, expandable } = this
        const result: any = []

        TableStore.Data.forEach((row: any, index: number) => {
            result.push(RRow(row, index))
            if (expandable) {
                result.push(RExpand(row, index))
            }
        })

        return <tbody>{result}</tbody>
    }
    private onDomUpdate(): void {
        const { noHeader, border } = this
        const $tableBody: any = this.$el.querySelector('tbody')

        if (!!$tableBody.children.length && !noHeader) {
            const widthMap: any = []
            const $headCells: any = $tableBody.children[0].children
            const vmTableHead: any = this.$parent.$refs.head
            let cellCount = $headCells.length
            while (cellCount --) {
                widthMap.unshift($headCells[cellCount].clientWidth + (border ? 0 : 0)) // +1px消去边框对宽度影响
            }

            vmTableHead.updateSize(widthMap)
        }
    }
    private mounted(): void {
        this.onDomUpdate()
        on(window, 'resize', this.onDomUpdate)
    }
    private updated(): void {
        this.onDomUpdate()
    }
    private beforeDestroy(): void {
        off(window, 'resize', this.onDomUpdate)
    }
    private render(): VNode {

        const { styles, RTBody } = this

        return  <div staticClass={prefix} style={styles}>
                    <table>{RTBody()}</table>
                </div>
    }
}

