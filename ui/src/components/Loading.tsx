import React from "react"
import {Spin} from "antd"
import {LoadingOutlined} from "@ant-design/icons"
import {UserSessionStatus, useUserSession} from "../hooks/userSession"

const antIcon = (
  <LoadingOutlined
    style={{fontSize: 48, fontWeight: "bold", color: "#458270"}}
    spin
  />
)

const LoadingScreen: React.FC = () => {
  const {user} = useUserSession()

  return (
    <>
      {user && user?.status !== UserSessionStatus.WIP ? null : (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.5)",
            zIndex: 9999,
            pointerEvents: "none", // Block mouse and keyboard events
          }}
        >
          <Spin size="large" indicator={antIcon} />
        </div>
      )}
    </>
  )
}

export default LoadingScreen
