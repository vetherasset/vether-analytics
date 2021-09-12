import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { prettifyNumber } from '../common/utils'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

export const HolderList = (props) => {

	const [page, setSkip] = useState(0)
	const holdersPerPage = 10
	let holderCount = 0
	let pageCount = 0

	const holders = gql`
		query {
			accounts(
				first: ${holdersPerPage},
				skip: ${page * holdersPerPage}
				orderBy: balance,
				orderDirection: desc
			) {
				address
				balance
			}
			globals(
				where: { id: "holderCount" }
			) {
				value
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
		holderCount = Number(data.globals[0].value)
		pageCount = Math.ceil(holderCount / holdersPerPage)
	}

	const paginationButton = (pageNumber, name, enabled = true) => {
		return (
			<Button
				variant='ghost'
				style={{
					boxShadow: 'none',
					fontWeight: page == pageNumber ? 'bold' : 'normal',
					width: '50px',
				}}
				disabled={ !enabled }
				onClick={() => { setSkip(Number(pageNumber)) }}>
				{ name }
			</Button>
		)
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
							return (
								<Tr key={index}>
									<Td>{account.address}</Td>
									<Td isNumeric>{prettifyNumber(Number(account.percentage), 0, 5)}%</Td>
									<Td isNumeric>{prettifyNumber(BigNumber(account.balance).div(1e18), 0, 5)}</Td>
								</Tr>
							)
						})}
						{loading && [...Array(holdersPerPage)].map((index) => {
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
					{ paginationButton(page - 1, <ChevronLeftIcon/>, page > 0) }
					{
						[...Array(pageCount)].map((key, index) => {
							if ((page < 4 && index < 5) || (page > pageCount - 5 && index > pageCount - 6)
								|| index == 0 || index == pageCount - 1
								|| index == page - 1 || index == page || index == page + 1) {
								return paginationButton(index, index + 1)
							}
							else if (index == page - 2) {
								return paginationButton(index, '...')
							}
							else if (index == pageCount - 6 && page > pageCount - 5) {
								return paginationButton(index, '...')
							}
							else if (index == page + 2) {
								return paginationButton(index, '...')
							}
							else if (index == 5 && page < 4) {
								return paginationButton(index, '...')
							}
						})
					}
					{ paginationButton(page + 1, <ChevronRightIcon/>, (page + 1) * holdersPerPage < holderCount - 1) }
				</Flex>
			</Flex>
		</Flex>
	)
}