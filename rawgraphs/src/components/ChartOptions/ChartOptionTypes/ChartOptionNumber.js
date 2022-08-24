import React from 'react'
import { Row, Col } from 'react-bootstrap'
import ChartOptionSelect from './ChartOptionSelect'

const ChartOptionNumber = ({
  value,
  error,
  onChange,
  default: defaultValue,
  label,
  isEnabled,
  ...props
}) => {
  if (props.options) {
    return (
      <ChartOptionSelect
        value={value}
        error={error}
        onChange={onChange}
        default={defaultValue}
        disabled={!isEnabled}
        label={label}
        {...props}
      />
    )
  }
  const cnMap = {
    'Width (px)': '宽度(px)',
    'Height (px)': '高度(px)',
    'Margin (top)': '上边距(px)',
    'Margin (right)': '右边距(px)',
    'Margin (bottom)': '底边距(px)',
    'Margin (left)': '左边距(px)',
    'Legend width': '展示栏宽度',
    'Donut thickness': '环厚度',
    'Grid columns': '每行放置分图个数',
    Padding: '图形间距',
    'Number of columns': '列数',
    'Dots diameter': '点直径',
    'Max. ticks on x axis': 'X轴放置的最大刻度个数',
  }
  return (
    <Row className={props.className}>
      <Col xs={6} className="d-flex align-items-center nowrap">
        {cnMap[label] || label}
      </Col>
      <Col xs={6}>
        <input
          className="w-100 form-control text-field"
          type="number"
          value={value ?? ''}
          step={props.step}
          min={props.min}
          max={props.max}
          disabled={!isEnabled}
          onChange={(e) => {
            const str = e.target.value
            if (str === '') {
              onChange(undefined)
            } else {
              const n = parseFloat(str)
              if (!isNaN(n)) {
                onChange(n)
              } else {
                onChange(undefined)
              }
            }
          }}
          placeholder={defaultValue}
        />
      </Col>
      {error && (
        <small>
          <i>{error}</i>
        </small>
      )}
    </Row>
  )
}

export default React.memo(ChartOptionNumber)
