import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex, Box, Heading, Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import BigNumber from 'bignumber.js'
import Chart from 'react-apexcharts'
import useLocalStorageState from 'use-local-storage-state'
import { prettifyNumber } from '../common/utils'

export const BurnChart = props => {

	const [chartInDate, setChartInDate] = useLocalStorageState('chartInDate', 0)

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
				chartInDate === 1 ? startDate + continuedDay * 86400000 : (Number(era) * 244 + Number(day)),
				prettifyNumber(BigNumber(units).div(1e18), 0, 5),
			])
		}
		for (const eraDay of data.eraDayUnitsRemainings) {
			const { era, day, units } = eraDay
			const continuedDay = (Number(era) - 1) * 244 + Number(day)
			remainingChartData.push([
				chartInDate ? startDate + continuedDay * 86400000 : (Number(era) * 244 + Number(day)),
				prettifyNumber(BigNumber(units).div(1e18), 0, 5),
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
				{ name: 'Unclaimed', data: remainingChartData },
			],
			tooltip: { theme: 'dark' },
			xaxis: {
				type: chartInDate > 0 ? 'datetime' : 'numeric',
				labels: {
					formatter: chartInDate > 0 ? undefined : eraDayFormatter,
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
				type: chartInDate > 0 ? 'datetime' : 'numeric',
				tickAmount: 30,
				labels: {
					formatter: chartInDate > 0 ? undefined : eraDayFormatter,
				},
			},
			yaxis: { tickAmount: 2 },
		},
	}

	return (
		<Flex {...props}>
			<div className="mixed-chart" style={{ width: '100%', height: '100%' }}>
				<Flex
					flexDir='row'
					justifyContent={{ base: 'center', lg: 'flex-end' }}
					flexWrap={{ base: 'wrap', lg: 'nowrap' }}
				>
					<Heading
						as='h4'
						size='xs'
						w={{ base: '100%', lg: 'auto' }}
						fontWeight='normal'
						fontStyle='italic'
						lineHeight='1'
						marginInlineStart='1.1rem'
						mb={{ base: '16px', lg: '0' }}
						display='flex'
						opacity='0.8'
						textStyle='noLigs'>
					Amount of Ether burnt daily
					</Heading>
					<Flex
						borderRadius='4px'
						ml={{ base: '0', lg: 'auto' }}
					>
						<Menu
							autoSelect={false}
						>
							<MenuButton
								as={Button}
								variant='grayFilled'
								rightIcon={<ChevronDownIcon />}
								fontSize='0.90rem'
								minW='180.883px'
							>
								<Box
									textTransform='uppercase'
									fontSize='0.68rem'
									opacity='0.70'
									pr='0.4rem'
									as='span'>
										Time format:
								</Box>
								{chartInDate === 0 &&
									<>
										Day/Era
									</>
								}
								{chartInDate > 0 &&
									<>
										Date
									</>
								}
							</MenuButton>
							<MenuList>
								<MenuItem onClick={() => setChartInDate(0)}>Day/Era</MenuItem>
								<MenuItem onClick={() => setChartInDate(1)}>Date</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				</Flex>

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