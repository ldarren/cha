import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Modal} from "antd"
import {UserSessionStatus, useUserSession} from "../hooks/userSession"

interface LoginProps {
  error?: 'default' | 'custom'
}

export default function Login({error = 'default'}: LoginProps) {
  const {user, login, logout} = useUserSession()
	const navigate = useNavigate()

  useEffect(() => {
    if (user === undefined) return
    const href = new URL(window.location.href)
    const code = href.searchParams.get('code')
    if (!user?.status && !code) {
      login()
    }
  }, [user])

  useEffect(() => {
    if (user?.status === UserSessionStatus.LOGIN) navigate('/terms')
  }, [user?.status])

  const Dialog = user?.status === UserSessionStatus.ERROR && (
    <Modal
      title="Oops! Error Happened"
      width="60%"
      open
      onOk={logout}
      closable={false}
      footer={[
        <Button key="ok" onClick={logout}>
          Retry
        </Button>,
      ]}
    >
      {error === "non-authorize" || user?.error_code === 461 ? (
        <>
          Oops! It appears that you are not part of the authorized list.
          <br />
          <br />
          If you would like to be part of it, please send your isid(s) to{" "}
          <a href="mailto:cha_support@cha.com">cha_support@cha.com</a>.
          <br />
        </>
      ) : (
        <>
          Oops! We encountered an error:{user?.error_code ?? 0} during your
          login process. It appears that the error is not related to your
          login credentials. There may be a problem with the network
          connectivity or our authentication service.
          <br />
          <br />
          Please click on the &apos;Retry&apos; button below to login again.
          If the error persists, please contact us at{" "}
          <a href="mailto:cha_support@cha.com">cha_support@cha.com</a>.
          <br />
        </>
      )}
    </Modal>
  )

  return Dialog
}