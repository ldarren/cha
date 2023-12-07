// src/App.jsx
import React from 'react'
import { Flex } from 'antd'
import { Outlet } from "react-router-dom"
import Launcher from './components/Launcher'

const appStyle: React.CSSProperties = {
  width: '100%',
}

const launcherStyle: React.CSSProperties = {
  flex: '0 0 20px',
  height: '100%',
	backgroundColor: '#001529',
  borderRadius: 6,
  border: '1px solid #40a9ff',
}

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flex: '1 1 100%',
  flexDirection: 'row',
  height: '100%',
	backgroundColor: '#001529',
  borderRadius: 6,
  border: '1px solid #40a9ff',
}

function App() {
	return <Flex style={appStyle} vertical={false} justify="space-evenly" align="center">
		<Launcher style={launcherStyle} />
    <div style={contentStyle}>
      <Outlet />
    </div>
	</Flex>
}

export default App
