import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, Heading, Flex, Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import vether from './themes/vether'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BurnChart } from './components/BurnChart'
import { GlobalsPanel } from './components/GlobalsPanel'
import { HolderChart } from './components/HolderChart'
import { HolderList } from './components/HolderList'

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
					<Tabs
						colorScheme='white'
						isLazy>
						<TabList
							p='0 1rem 0.4rem'
						>
							<Tab
								minW='233px'
								flexDir='column'
							>
								<div style={{
									textTransform: 'uppercase',
									fontSize: '0.78rem',
									fontWeight: 'bold',
									opacity: '0.6',
								}}>Total</div>
								<div>Value Burnt</div>
							</Tab>
							<Tab
								minW='235px'
								flexDir='column'
							>
								<div style={{
									textTransform: 'uppercase',
									fontWeight: 'bold',
									fontSize: '0.78rem',
									opacity: '0.6',
								}}>Top</div>
								<div>Holder Accounts</div>
							</Tab>
						</TabList>
						<Box
							h='auto'
							bg='rgb(42, 42, 42)'
							borderRadius='1.4rem'
							border='1px solid rgba(255, 255, 255, 0.2)'
							m='1rem'
							p='3.4rem 2.3rem 3.3rem'>
							<GlobalsPanel
								pt='0.3rem'
								minH='121.6px'/>
							<TabPanels>
								<TabPanel>
									<BurnChart
										height='calc(100vh - 465.1167px)'
										pb='160px'
									/>
								</TabPanel>
								<TabPanel
									display='flex'
									flexDir='row'
									justifyContent='center'
								>
									<Flex
										width='49%'
										flexDir='column'>
										<Heading
											as='h4'
											size='xs'
											fontWeight='normal'
											fontStyle='italic'
											lineHeight='1'
											marginInlineStart='1.1rem'
											mb='5px'
											opacity='0.8'
											textStyle='noLigs'>
												Top Holder Accounts
										</Heading>
										<HolderChart
											flexDirection='column'
											justifyContent='center'
											alignItems='center'
											height='calc(100vh - 484.1167px)'
										/>
									</Flex>
									<Flex
										width='51%'
										alignItems='center'>
										<HolderList
											width='100%'
											justifyContent='center'
										/>
									</Flex>
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
