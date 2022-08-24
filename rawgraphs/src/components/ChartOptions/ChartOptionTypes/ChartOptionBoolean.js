import React from 'react'
import { Row, Col, Form } from 'react-bootstrap'

const ChartOptionBoolean = ({
  optionId,
  label,
  value,
  error,
  onChange,
  className,
  isEnabled,
}) => {
  const cnMap = {
    'Show legend': '图例展示栏',
    'Draw as donuts': '展示成环形图',
    'Show grid': '展示分图间分割线',
    'Show pies titles': '展示饼图名称',
    'Show values on arcs': '在扇形上显示值',
    'Use same scale': '使用相同比例',
    'Show series titles': '展示分图表头',
    'Repeat axis labels for each series': '每个分图都展示双轴名称',
    'Show series grid': '展示分图间分割线',
    'Show dots on data values': '是否在图上展示数据点',
    'Set Y origin to 0': '设置Y轴原点为0',
    'Auto-place ticks on x axis': '展示坐标轴刻度名称',
    'Show min/max on x axis': '在X轴显示最大/小值',
    'Show labels': '显示标签',
  }
  return (
    <Row className={className}>
      <Col xs={6} className="d-flex align-items-center nowrap">
        {cnMap[label] || label}
      </Col>
      <Form className="col-6 d-flex align-items-center">
        <Form.Check
          type="switch"
          checked={!!value}
          disabled={!isEnabled}
          onChange={(e) => {
            onChange(e.target.checked)
          }}
          id={optionId}
          label={value ? 'Yes' : 'No'}
        />
      </Form>
      {error && (
        <div className="col-12">
          <small>
            <i>{error}</i>
          </small>
        </div>
      )}
    </Row>
  )
}

export default React.memo(ChartOptionBoolean)
