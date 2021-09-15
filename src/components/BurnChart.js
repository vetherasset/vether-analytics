import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex, Heading } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Chart from 'react-apexcharts'

export const BurnChart = props => {
	const [chartInDate] = useState(false)

	const eraDayUnits = gql`
		query {
			eraDayUnits(first: 1000) {
				era
				day
				units
			}
			eraDayUnitsRemainings(first: 1000) {
				era
				day
				units
			}
		}
	`

	const { data } = useQuery(eraDayUnits)
	const startDate = 1589271741000
	const unitsChartData = []
	const remainingChartData = []

	if (data) {
		for (const eraDay of data.eraDayUnits) {
			const { era, day, units } = eraDay
			const continuedDay = (Number(era) - 1) * 244 + Number(day)
			unitsChartData.push([
				chartInDate ? startDate + continuedDay * 86400000 : (Number(era) * 244 + Number(day)),
				new BigNumber(units).div(1e18).toFixed(2),
			])
		}
		for (const eraDay of data.eraDayUnitsRemainings) {
			const { era, day, units } = eraDay
			const continuedDay = (Number(era) - 1) * 244 + Number(day)
			remainingChartData.push([
				chartInDate ? startDate + continuedDay * 86400000 : (Number(era) * 244 + Number(day)),
				new BigNumber(units).div(1e18).toFixed(2),
			])
		}
	}
	else {
		unitsChartData.push([0, 0])
		remainingChartData.push([0, 0])
	}
	unitsChartData.sort()
	remainingChartData.sort()

	const eraDayFormatter = (value) => {
		const era = Math.floor(value / 244)
		const day = Math.floor(value % 244)
		return `${day}/${era}`
	}

	const state = {
		options1: {
			chart: {
				id: 'chart2',
				type: 'area',
				height: 230,
				foreColor: '#ccc',
				toolbar: {
					autoSelected: 'pan',
					show: false,
				},
			},
			colors: ['#ff596f', '#5559bf'],
			stroke: { width: 2 },
			grid: {
				borderColor: '#555',
				clipMarkers: false,
				yaxis: {
					lines: {
						show: false,
					},
				},
			},
			dataLabels: { enabled: false },
			fill: {
				gradient: {
					enabled: true,
					opacityFrom: 1,
					opacityTo: 0,
				},
			},
			series: [
				{ name: 'Burnt', data: unitsChartData },
				{ name: 'Remaining', data: remainingChartData },
			],
			tooltip: { theme: 'dark' },
			xaxis: {
				type: chartInDate ? 'datetime' : 'numeric',
				labels: {
					formatter: chartInDate ? undefined : eraDayFormatter,
				},
				axisBorder: { show: false },
				axisTicks: { show: false },
			},
			yaxis: { min: 0, tickAmount: 5 },
		},
		options2: {
			chart: {
				id: 'chart1',
				height: 130,
				type: 'bar',
				foreColor: '#ccc',
				brush: {
					target: 'chart2',
					enabled: true,
				},
				selection: {
					enabled: true,
					fill: {
						color: '#fff',
						opacity: 0.4,
					},
					xaxis: {
						min: unitsChartData[0][0],
						max: unitsChartData[unitsChartData.length - 1][0],
					},
				},
			},
			colors: ['#ff596f', '#5559bf'],
			series: [
				{ name: 'Burnt', data: unitsChartData },
				{ name: 'Remaining', data: remainingChartData },
			],
			stroke: { width: 2 },
			xaxis: {
				type: chartInDate ? 'datetime' : 'numeric',
				tickAmount: 30,
				labels: {
					formatter: chartInDate ? undefined : eraDayFormatter,
				},
			},
			yaxis: { tickAmount: 2 },
		},
	}

	return (
		<Flex {...props}>
			<div className="mixed-chart" style={{ width: '100%', height: '100%' }}>
				<Heading
					as='h4'
					size='xs'
					fontWeight='normal'
					fontStyle='italic'
					lineHeight='1'
					marginInlineStart='1.1rem'
					mb='5px'
					display='flex'
					opacity='0.8'
					textStyle='noLigs'>
					Amount of Ether burnt daily
					{/* <Button
						variant='ghost'
						marginLeft='auto'
						onClick={ () => { setChartType(!chartInDate) } }>
						{ chartInDate ? 'Date' : 'Era / Day'}
					</Button> */}
				</Heading>
				<Chart
					options={state.options1}
					series={state.options1.series}
					type="area"
					width="100%"
					height="100%"
				/>
				<Chart
					options={state.options2}
					series={state.options2.series}
					type="bar"
					width="100%"
					height="140px"
					style={{ opacity: '0.3' }}
				/>
			</div>
		</Flex>
	)
}