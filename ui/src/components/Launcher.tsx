import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Flex, Menu} from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  MessageOutlined,
  DashboardOutlined,
} from '@ant-design/icons'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items1: MenuItem[] = [
  getItem('Chats', '/chats', <MessageOutlined />),
  getItem('Plugins', '/plugins', <AppstoreOutlined />),
  getItem('Dashboard', '/dashboard', <DashboardOutlined />),
]

const items2: MenuItem[] = [
  getItem('Settings', '#settings', <SettingOutlined />),
  getItem('User Account', '#users', <UserOutlined />),
]

interface LauncherElementProps {
  style?: React.CSSProperties
}

const Launcher = (props: LauncherElementProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState<string>('')

  useEffect(() => {
    let key = location.pathname
    const idx = key.indexOf('/', 1)
    if (-1 !== idx){
      key = key.substring(0, key.indexOf('/', 1))
    }
    console.log('current path', key)
    setSelectedKey(key)
  }, [location])

  const onSelect: MenuProps['onSelect'] = (e) => {
    e.domEvent.preventDefault()
    if (selectedKey === e.key) return
    setSelectedKey(e.key)
    navigate(e.key)
  }

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click', e)
  }

  return <Flex style={props.style} vertical={true} justify="space-between" align="center">
		<Menu
			mode="inline"
			theme="dark"
			inlineCollapsed={true}
			items={items1}
      onSelect={onSelect}
      selectedKeys={[selectedKey]}
		/>
		<Menu
			mode="inline"
			theme="dark"
      selectable={false}
			inlineCollapsed={true}
			items={items2}
      onClick={onClick}
		/>
	</Flex>
}

export default Launcher
