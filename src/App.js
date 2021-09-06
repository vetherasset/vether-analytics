import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ChakraProvider, Flex, Box, ScaleFade } from '@chakra-ui/react'
import vether from './themes/vether'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import BurnChart from './components/BurnChart'
import HolderChart from './components/HolderChart'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={vether}>
				<Flex
					height='100vh'
					pb={{ base: '76px', sm: '0' }}
					flexDir='column'>
					<Header width='100%'
						p='1.2rem 1rem'
						justifyContent='center'/>
					<Box h='calc(100vh-2.4rem)'
						justifyContent='center'
						mx={{ base: '0.5rem', sm: '1rem', md: '2.5rem', lg: '13rem' }}
						p={3}>
						<Switch>
							<Route path='/' exact render={() =>
								<ScaleFade
									initialScale={0.95}
									in={true}
									unmountOnExit>
									<BurnChart/>
									<HolderChart/>
								</ScaleFade>
							}/>
							<Route path='*' render={() =>
								<Redirect to={'/'} />
							} />
						</Switch>
						<Footer/>
					</Box>
				</Flex>
			</ChakraProvider>
		</Router>
	)
}

export default App
