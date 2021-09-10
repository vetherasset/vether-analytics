import React from 'react'
import { Flex, Stack, Box } from '@chakra-ui/react'
import { useQuery, gql } from '@apollo/client'
import BigNumber from 'bignumber.js'
import { prettifyNumber } from '../common/utils'

export const GlobalsPanel = (props) => {

	const globals = gql`
		query {
			globals(
				where: { id_in: [
					"currentDay"
					"currentEra"
					"emission"
					"excludeCount"
					"totalBurnt"
					"totalEmitted"
					"totalFees"
				] }
			) {
				id
				value
			}
		}
	`

	const { data } = useQuery(globals)

	return (
		<Flex {...props}>
			<Stack
				direction={['column', 'row']}
				w='100%'
				p='0 4rem'
				justifyContent='space-between'>
				{data &&
					data.globals.map((global, index) => {
						return (
							<Box
								textAlign='center'
								key={index}>
								<Box fontSize='1.6rem' fontWeight='normal'>
									{(() => {
										switch (global.id) {
										case 'emission': return prettifyNumber(BigNumber(global.value).div(1e18), 0, 0)
										case 'totalBurnt': return prettifyNumber(BigNumber(global.value).div(1e18), 0, 2)
										case 'totalEmitted': return prettifyNumber(BigNumber(global.value).div(1e18).toFixed(0))
										case 'totalFees': return prettifyNumber(BigNumber(global.value).div(1e18), 0, 2)
										default: return global.value
										}
									})()}
								</Box>
								<Box fontSize='0.8rem' fontWeight='normal' opacity='0.7'>
									{(() => {
										switch (global.id) {
										case 'currentDay': return 'Current Day'
										case 'currentEra': return 'Current Era'
										case 'emission': return 'Emission'
										case 'totalBurnt': return 'Total Burnt'
										case 'totalEmitted': return 'Total Emitted'
										case 'totalFees': return 'Total Fees'
										default: return global.id
										}
									})()}
								</Box>
							</Box>
						)
					})}
			</Stack>
		</Flex>
	)
}
