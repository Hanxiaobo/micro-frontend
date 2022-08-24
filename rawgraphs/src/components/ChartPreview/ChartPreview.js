import React, { useRef, useEffect } from 'react'
import { chart as rawChart } from '@rawgraphs/rawgraphs-core'
import useDebounce from '../../hooks/useDebounce'
import WarningMessage from '../WarningMessage'
import { onChartRendered } from '../../gaEvents'

const ChartPreview = ({
  chart,
  dataset: data,
  dataTypes,
  mapping,
  visualOptions,
  error,
  setError,
  setRawViz,
  mappedData,
}) => {
  const domRef = useRef(null)

  const vizOptionsDebounced = useDebounce(visualOptions, 200)

  const cnMap = {
    Bars: 'X轴维度',
    Arcs: '统计维度',
    'X Axis': 'X轴维度',
    'Y Axis': 'Y轴维度',
    Size: '值字段',
  }
  useEffect(() => {
    setError(null)

    // control required variables
    // need to create this array because the prop mapping does not return to {} when data is inserted and removed
    const currentlyMapped = []
    for (let variable in mapping) {
      if (mapping[variable].ids && mapping[variable].ids.length > 0) {
        currentlyMapped.push(variable)
      }
    }

    let requiredVariables = chart.dimensions.filter(
      (d) => d.required && currentlyMapped.indexOf(d.id) === -1
    )

    if (requiredVariables.length > 0) {
      let errorMessage = (
        <span>
          缺少必须的图形变量: 你需要设置{' '}
          {requiredVariables
            .map((d, i) => (
              <span key={i} className="font-weight-bold">
                {cnMap[d.name] || d.name}
              </span>
            ))
            .reduce((prev, curr) => [prev, ' 和 ', curr])}
        </span>
      )
      setError({ variant: 'secondary', message: errorMessage })
      setRawViz(null)
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      return
    }

    // control multiple required variables
    const multivaluesVariables = chart.dimensions.filter(
      (d) =>
        d.multiple &&
        d.required &&
        d.minValues &&
        mapping[d.id].ids.length < d.minValues
    )
    if (multivaluesVariables.length > 0) {
      let errorMessage = (
        <span>
          Please map{' '}
          {multivaluesVariables
            .map((d) => (
              <>
                at least <span className="font-weight-bold">{d.minValues}</span>{' '}
                dimensions on <span className="font-weight-bold">{d.name}</span>
              </>
            ))
            .reduce((prev, curr) => [prev, ' and ', curr])}
          .
        </span>
      )
      setError({ variant: 'secondary', message: errorMessage })
      setRawViz(null)
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      return
    }

    // control data-types mismatches
    for (let variable in mapping) {
      if (
        mapping[variable].ids &&
        mapping[variable].ids.length > 0 &&
        !mapping[variable].isValid
      ) {
        const variableObj = chart.dimensions.find((d) => d.id === variable)
        const errorMessage = `Data-type mismatch: you can’t map ${mapping[variable].mappedType}s on ${variableObj.name}.`
        setError({ variant: 'danger', message: errorMessage })
        setRawViz(null)
        while (domRef.current.firstChild) {
          domRef.current.removeChild(domRef.current.firstChild)
        }
        return
      }
    }

    if (!mappedData) {
      // console.info('Clearing viz')
      setRawViz(null)
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      return
    }
    // console.info('Updating viz')
    try {
      const viz = rawChart(chart, {
        data,
        mapping: mapping,
        dataTypes,
        visualOptions: vizOptionsDebounced,
      })
      try {
        const rawViz = viz.renderToDOM(domRef.current, mappedData)
        setRawViz(rawViz)
        setError(null)
        onChartRendered(chart.metadata)
      } catch (e) {
        console.log('chart error', e)
        setError({ variant: 'danger', message: 'Chart error. ' + e.message })
        setRawViz(null)
      }
    } catch (e) {
      while (domRef.current.firstChild) {
        domRef.current.removeChild(domRef.current.firstChild)
      }
      console.log({ e })
      setError({ variant: 'danger', message: 'Chart error. ' + e.message })
      setRawViz(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setError, vizOptionsDebounced, setRawViz, mappedData, chart, mapping])

  return (
    <div className={'col-8 col-xl-9'}>
      <div
        className={['overflow-auto', 'position-sticky'].join(' ')}
        style={{ top: 'calc(15px + var(--header-height))' }}
      >
        {error && (
          <WarningMessage variant={error.variant} message={error.message} />
        )}
        <div ref={domRef}>{/* Don't put content in this <div /> */}</div>
      </div>
    </div>
  )
}

export default React.memo(ChartPreview)
