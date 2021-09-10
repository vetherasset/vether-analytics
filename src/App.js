import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, Flex, Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import vether from './themes/vether'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BurnChart } from './components/BurnChart'
import { GlobalsPanel } from './components/GlobalsPanel'

const App = () => {

	return (
		<Router>
			<ChakraProvider theme={vether}>
				<Flex
					height='100%'
					flexDir='column'>
					<Header width='100%'
						p='1.2rem 1rem'
						justifyContent='center'/>
					<Tabs isLazy>
						<TabList
							p='0 1rem'
						>
							<Tab>Value Burnt</Tab>
							<Tab>Holder Accounts</Tab>
						</TabList>
						<Box
							h='auto'
							bg='rgb(42, 42, 42)'
							borderRadius='1.4rem'
							m='1rem'
							p='3.4rem 2.3rem 3rem'>
							<GlobalsPanel pb='4rem' minH='121.6px'/>
							<TabPanels>
								<TabPanel>
									<BurnChart/>
								</TabPanel>
								<TabPanel>
									<p>Holders!</p>
								</TabPanel>
							</TabPanels>
						</Box>
					</Tabs>
					<Footer/>
				</Flex>
			</ChakraProvider>
		</Router>
	)
}

export default App
