import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Modal, Typography} from "antd"

const {Link} = Typography

export default function Terms() {
  const [isTermsOpen, setIsTermsOpen] = useState<boolean | undefined>()
	const navigate = useNavigate()

  useEffect(() => {
    if (isTermsOpen === undefined) {
      setIsTermsOpen(true)
    }
  }, [isTermsOpen])

  const onOk = () => {
    setIsTermsOpen(false)
    navigate('/chats')
  }

  const Dialog = (
    <Modal
      title="Declaration"
      open={isTermsOpen}
      onOk={onOk}
      width="60%"
      footer={[
        <Button key="ok" onClick={onOk}>
          I Agree
        </Button>,
      ]}
      closable={false}
    >
      <ul>
        <li>
          Don't be evil
        </li>
        <li>
					Do the right thing
        </li>
      </ul>
    </Modal>
  )

  return Dialog
}
