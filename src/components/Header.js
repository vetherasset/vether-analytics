import React from 'react'
import { Flex, Spacer, useBreakpointValue } from '@chakra-ui/react'

import { Logotype } from './Logotype'
import { InfoMenu } from './InfoMenu'

export const Header = (props) => {

	const size = useBreakpointValue({
		base: 'sm',
		sm: 'sm',
		md: 'md',
	})

	return (
		<Flex {...props}>
			<Flex>
				<Logotype
					maxWidth='147px'
					minHeight='60px'
					transform='scale(0.9)' />
			</Flex>
			<Spacer />
			<Flex justifyContent='flex-end' alignItems='center'>
				{useBreakpointValue({
					base: '',
					sm: <InfoMenu size={size} />,
				})}
			</Flex>
		</Flex>
	)
}
