// Libraries
import React, {SFC} from 'react'
import {connect} from 'react-redux'

// Components
import {Form, Input, Grid} from '@influxdata/clockface'
import {Dropdown, MultiSelectDropdown} from 'src/clockface'
import ColorSchemeDropdown from 'src/shared/components/ColorSchemeDropdown'
import AxisAffixes from 'src/timeMachine/components/view_options/AxisAffixes'

// Actions
import {
  setFillColumns,
  setSymbolColumns,
  setColors,
  setYAxisLabel,
  setXAxisLabel,
  setAxisPrefix,
  setAxisSuffix,
} from 'src/timeMachine/actions'

// Utils
import {
  getGroupableColumns,
  getFillColumnsSelection,
  getSymbolColumnsSelection,
} from 'src/timeMachine/selectors'

// Types
import {ComponentStatus} from '@influxdata/clockface'
import {Color} from 'src/types/colors'
import {AppState} from 'src/types'

interface StateProps {
  fillColumns: string[]
  symbolColumns: string[]
  availableGroupColumns: string[]
}

interface DispatchProps {
  onSetFillColumns: typeof setFillColumns
  onSetSymbolColumns: typeof setSymbolColumns
  onSetColors: typeof setColors
  onSetYAxisLabel: typeof setYAxisLabel
  onSetXAxisLabel: typeof setXAxisLabel
  onUpdateAxisSuffix: typeof setAxisSuffix
  onUpdateAxisPrefix: typeof setAxisPrefix
}

interface OwnProps {
  xColumn: string
  yColumn: string
  fillColumns: string[]
  symbolColumns: string[]
  xDomain: [number, number]
  yDomain: [number, number]
  xAxisLabel: string
  yAxisLabel: string
  xPrefix: string
  xSuffix: string
  yPrefix: string
  ySuffix: string
  colors: Color[]
  showNoteWhenEmpty: boolean
}

type Props = OwnProps & DispatchProps & StateProps

const ScatterOptions: SFC<Props> = props => {
  const {
    fillColumns,
    symbolColumns,
    colors,
    availableGroupColumns,
    yAxisLabel,
    xAxisLabel,
    onSetFillColumns,
    onSetSymbolColumns,
    onSetColors,
    onSetYAxisLabel,
    onSetXAxisLabel,
    yPrefix,
    ySuffix,
    onUpdateAxisSuffix,
    onUpdateAxisPrefix,
  } = props

  const groupDropdownStatus = availableGroupColumns.length
    ? ComponentStatus.Default
    : ComponentStatus.Disabled

  return (
    <Grid.Column>
      <h4 className="view-options--header">Customize Scatter Plot</h4>
      <h5 className="view-options--header">Data</h5>

      <Form.Element label="Symbol domain column">
        <MultiSelectDropdown
          selectedIDs={symbolColumns}
          onChange={onSetSymbolColumns}
          status={groupDropdownStatus}
        >
          {availableGroupColumns.map(columnName => (
            <Dropdown.Item
              id={columnName}
              key={columnName}
              value={{id: columnName}}
            >
              {columnName}
            </Dropdown.Item>
          ))}
        </MultiSelectDropdown>
      </Form.Element>
      <Form.Element label="Fill domain column">
        <MultiSelectDropdown
          selectedIDs={fillColumns}
          onChange={onSetFillColumns}
          status={groupDropdownStatus}
        >
          {availableGroupColumns.map(columnName => (
            <Dropdown.Item
              id={columnName}
              key={columnName}
              value={{id: columnName}}
            >
              {columnName}
            </Dropdown.Item>
          ))}
        </MultiSelectDropdown>
      </Form.Element>
      <h5 className="view-options--header">Options</h5>
      <Form.Element label="Colors">
        <ColorSchemeDropdown
          value={colors.filter(c => c.type === 'scale')}
          onChange={onSetColors}
        />
      </Form.Element>
      <h5 className="view-options--header">Y Axis</h5>
      <Form.Element label="Y Axis Label">
        <Input
          value={yAxisLabel}
          onChange={e => onSetYAxisLabel(e.target.value)}
        />
      </Form.Element>
      <AxisAffixes
        prefix={yPrefix}
        suffix={ySuffix}
        axisName="y"
        onUpdateAxisPrefix={prefix => onUpdateAxisPrefix(prefix, 'y')}
        onUpdateAxisSuffix={suffix => onUpdateAxisSuffix(suffix, 'y')}
      />
      <h5 className="view-options--header">X Axis</h5>
      <Form.Element label="X Axis Label">
        <Input
          value={xAxisLabel}
          onChange={e => onSetXAxisLabel(e.target.value)}
        />
      </Form.Element>
    </Grid.Column>
  )
}

const mstp = (state: AppState): StateProps => {
  const availableGroupColumns = getGroupableColumns(state)
  const fillColumns = getFillColumnsSelection(state)
  const symbolColumns = getSymbolColumnsSelection(state)

  return {availableGroupColumns, fillColumns, symbolColumns}
}

const mdtp = {
  onSetFillColumns: setFillColumns,
  onSetSymbolColumns: setSymbolColumns,
  onSetColors: setColors,
  onSetYAxisLabel: setYAxisLabel,
  onSetXAxisLabel: setXAxisLabel,
  onUpdateAxisPrefix: setAxisPrefix,
  onUpdateAxisSuffix: setAxisSuffix,
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mstp,
  mdtp
)(ScatterOptions)