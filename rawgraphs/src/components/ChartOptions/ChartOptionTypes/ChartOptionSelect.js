import React from 'react'
import { Row, Col } from 'react-bootstrap'
import isObject from 'lodash/isObject'

const ChartOptionSelect = ({
  options = [],
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  ...props
}) => {
  const cnMap = {
    'Sort arcs by': '扇形排序',
    'Sort pies by': '分图排序',
    'Bars orientation': '柱形图方向',
    'Sort bars by': 'X轴坐标排序',
    'Sort series by': '分图排序',
    'Sort stacks by': '堆积值排序',
    'Sort X axis by': 'X轴坐标排序',
    'Curve type': '折线类型',
    'Labels position': '标签位置',
    Vertically: '垂直',
    Horizontally: '水平',
  }
  return (
    <Row className={props.className}>
      <Col xs={6} className="d-flex align-items-center nowrap">
        {cnMap[label] || label}
      </Col>
      <Col xs={6}>
        <select
          className="custom-select raw-select"
          value={value ?? defaultValue}
          onChange={(e) => {
            const stringValue = e.target.value
            const value =
              props.type === 'number' ? Number(stringValue) : stringValue
            onChange(value)
          }}
        >
          {options.map((option) =>
            isObject(option) ? (
              <option key={option.value} value={option.value}>
                {cnMap[option.label] || option.label}
              </option>
            ) : (
              <option key={option} value={option}>
                {cnMap[option] || option}
              </option>
            )
          )}
        </select>
        {error && (
          <small>
            <i>{error}</i>
          </small>
        )}
      </Col>
    </Row>
  )
}

export default React.memo(ChartOptionSelect)
