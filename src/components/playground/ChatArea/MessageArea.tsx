'use client'

import { usePlaygroundStore } from '@/store'
import Messages from './Messages'
import ScrollToBottom from '@/components/playground/ChatArea/ScrollToBottom'
import { StickToBottom } from 'use-stick-to-bottom'

const MessageArea = () => {
  const { messages } = usePlaygroundStore()

  return (
    <StickToBottom
      className="relative mb-4 flex max-h-[calc(100vh-64px)] flex-grow flex-col bg-background/80 overflow-hidden"
      resize="smooth"
      initial="smooth"
    >
      <StickToBottom.Content className="flex flex-col">
        <div className="mx-auto w-full max-w-2xl space-y-9 px-4 pb-4">
          <Messages messages={messages} />
        </div>
      </StickToBottom.Content>
      <ScrollToBottom />
    </StickToBottom>
  )
}

export default MessageArea
