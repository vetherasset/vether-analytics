import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Chart from 'react-apexcharts'

const HolderChart = props => {
	const holders = gql`
		query {
			accounts(first: 300, orderBy: balance, orderDirection: desc) {
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
		theme: {
			monochrome: {
				enabled: true,
			},
		},
		stroke: {
			colors: ['#FF0080'],
			width: 2,
		},
		fill: {
			colors: ['#00000000'],
		},
		tooltip: {
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
		title: {
			text: 'Holders',
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
		<Flex {...props} >
			<Chart
				options={options}
				series={options.series}
				type="pie"
				width="600px"
				height="500px"
				style={{ margin: 'auto' }}
			/>
		</Flex>
	)
}

export default HolderChart
