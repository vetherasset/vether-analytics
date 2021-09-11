import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex, Box } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Chart from 'react-apexcharts'

export const HolderChart = props => {
	const holders = gql`
		query {
			accounts(
				first: 300,
				orderBy: balance,
				orderDirection: desc
			) {
				address
				balance
			}
		}
	`

	const { data } = useQuery(holders)
	const chartData = []

	if (data) {
		let total = 0
		for (const holder of data.accounts) {
			const percentage = Number(new BigNumber(holder.balance).div(1e22).toFixed(2))
			total += percentage
			chartData.push({
				address: holder.address,
				balance: percentage,
			})
		}
		chartData.push({
			address: 'Others',
			balance: Number(new BigNumber(100 - total).toFixed(2)),
		})
	}

	const options = {
		chart: {
			id: 'holders',
			type: 'pie',
		},
		stroke: {
			colors: ['#ff596f'],
			width: 2,
		},
		fill: {
			colors: ['#00000020'],
		},
		theme: {
			theme: 'dark',
			monochrome: {
				enabled: true,
				color: '#ff596f',
				shadeTo: 'dark',
				shadeIntensity: '0.2',
			},
		},
		tooltip: {
			custom: function({ series, seriesIndex, w }) {
				return `
					<div class="arrow_box"
						style="background: rgba(30, 30, 30, 0.8); font-size: 1rem; text-align: center;
						padding: 3px 12px;">
						<div>${w.globals.labels[seriesIndex]}</div>
						<div style="font-weight: bold;">${Number(series[seriesIndex]).toFixed(1)}%</div>
					</div>
				`
			},
			style: {
				fontSize: '12px',
				fontFamily: undefined,
			},
			y: {
				formatter(val) {
					return val + '%'
				},
			},
		},
		plotOptions: {
			pie: {
				dataLabels: {
					offset: -5,
				},
			},
		},
		dataLabels: {
			formatter(val, opts) {
				const name = opts.w.globals.labels[opts.seriesIndex]
				return [name, val.toFixed(1) + '%']
			},
		},
		legend: {
			show: false,
		},
		series: chartData.map(holder => holder.balance),
		labels: chartData.map(holder => holder.address),
	}

	return (
		<Flex {...props}>
			<Box
				height='100%'
				maxH='533px'>
				<Chart
					options={options}
					series={options.series}
					type="pie"
					width="533px"
					height='100%'
					maxHeight="533px"
					style={{ margin: 'auto' }}
				/>
			</Box>
		</Flex>
	)
}