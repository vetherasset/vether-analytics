import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Flex } from '@chakra-ui/react'


export const BurnChart = (props) => {

	const burnEvents = gql`
  query {
		burnEvents(
			orderBy: day
			orderDirection: asc
			where: { era: 2 }
		) {
			era
			day
		}
	}
	`

	const { data } = useQuery(burnEvents)

	console.log(data)

	return (
		<Flex {...props}>
			 burns
		</Flex>
	)
}
