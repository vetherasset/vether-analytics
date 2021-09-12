import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { prettifyNumber } from '../common/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

export const HolderList = (props) => {

	const [skip, setSkip] = useState(9)
	const [first] = useState(300)

	const holders = gql`
		query {
			accounts(
				first: ${first},
				orderBy: balance,
				orderDirection: desc
			) {
				address
				balance
			}
		}
	`

	const { data, loading } = useQuery(holders)
	const tableData = []

	if (data) {
		for (const holder of data.accounts) {
			const percentage = Number(new BigNumber(holder.balance).div(1e22).toFixed(2))
			tableData.push({
				address: holder.address,
				balance: holder.balance,
				percentage: percentage,
			})
		}
	}

	return (
		<Flex {...props}>
			<Flex
				flexDir='column'
				w='100%'>
				<Table
					variant='striped'
					colorScheme='gray'
					size='sm'
					w='100%'
					h='auto'>
					<Thead>
						<Tr>
							<Th>address</Th>
							<Th isNumeric>Percentage</Th>
							<Th isNumeric>Balance</Th>
						</Tr>
					</Thead>
					<Tbody>
						{tableData && tableData.map((account, index) => {
							if(index <= skip && !(index <= skip - 10)) {
								console.log(index)
								return (
									<Tr key={index}>
										<Td>{account.address}</Td>
										<Td isNumeric>{prettifyNumber(Number(account.percentage), 0, 5)}%</Td>
										<Td isNumeric>{prettifyNumber(BigNumber(account.balance).div(1e18), 0, 5)}</Td>
									</Tr>
								)
							}
						})}
						{loading && [...Array(10)].map((index) => {
							return(
								<Tr
									key={index}
									height='33px'
								>
									<Td w='100%'></Td>
									<Td w='100%' isNumeric></Td>
									<Td w='100%' isNumeric></Td>
								</Tr>
							)
						})}
					</Tbody>
				</Table>
				<Flex
					flexDir='row'
					alignItems='center'
					justifyContent='center'
					mt='17px'>
					<Button
						variant='ghost'
						onClick={() => {
							if(skip > 9) setSkip(Number(skip - 10))
						}}>
						<ChevronLeftIcon/>
					</Button>
					<Flex
						mx='13px'
					>
						{Math.ceil(skip / 10)} of {Math.ceil(first / 10)}
					</Flex>
					<Button
						variant='ghost'
						onClick={() => {
							if(skip < (first - 1)) setSkip(Number(skip + 10))
						}}>
						<ChevronRightIcon/>
					</Button>
				</Flex>
			</Flex>
		</Flex>
	)
}