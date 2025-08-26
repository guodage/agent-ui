import Icon from '@/components/ui/icon'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer'
import { usePlaygroundStore } from '@/store'
import type { PlaygroundChatMessage } from '@/types/playground'
import Videos from './Multimedia/Videos'
import Images from './Multimedia/Images'
import Audios from './Multimedia/Audios'
import { memo } from 'react'
import AgentThinkingLoader from './AgentThinkingLoader'

interface MessageProps {
  message: PlaygroundChatMessage
  isLastMessage?: boolean
}

const AgentMessage = ({ message, isLastMessage = false }: MessageProps) => {
  const { streamingErrorMessage, isStreaming } = usePlaygroundStore()
  
  let messageContent
  if (message.streamingError) {
    messageContent = (
      <p className="text-destructive">
        Oops! Something went wrong while streaming.{' '}
        {streamingErrorMessage ? (
          <>{streamingErrorMessage}</>
        ) : (
          'Please try refreshing the page or try again later.'
        )}
      </p>
    )
  } else if (message.content) {
    // 🎆 简化渲染策略：统一使用MarkdownRenderer，处理换行符问题
    // 处理流式传输中常见的转义换行符：\\n\\n -> \n\n, \\n -> \n
    // 同时处理可能的双重转义：\\\\n -> \n
    const processedContent = message.content
      .replace(/\\\\n\\\\n/g, '\n\n')  // 处理双重转义的双换行
      .replace(/\\\\n/g, '\n')          // 处理双重转义的单换行
      .replace(/\\n\\n/g, '\n\n')        // 处理标准转义的双换行
      .replace(/\\n/g, '\n')             // 处理标准转义的单换行
    
    messageContent = (
      <div className="flex w-full flex-col gap-4">
        <MarkdownRenderer>{processedContent}</MarkdownRenderer>
        {message.videos && message.videos.length > 0 && (
          <Videos videos={message.videos} />
        )}
        {message.images && message.images.length > 0 && (
          <Images images={message.images} />
        )}
        {message.audio && message.audio.length > 0 && (
          <Audios audio={message.audio} />
        )}
      </div>
    )
  } else if (message.response_audio) {
    if (!message.response_audio.transcript) {
      messageContent = (
        <div className="mt-2 flex items-start">
          <AgentThinkingLoader />
        </div>
      )
    } else {
      // 统一使用 MarkdownRenderer，处理音频转录中的换行符
      const processedTranscript = message.response_audio.transcript.replace(/\\n\\n/g, '\n\n').replace(/\\n/g, '\n')
      
      messageContent = (
        <div className="flex w-full flex-col gap-4">
          <MarkdownRenderer>
            {processedTranscript}
          </MarkdownRenderer>
          {message.response_audio.content && message.response_audio && (
            <Audios audio={[message.response_audio]} />
          )}
        </div>
      )
    }
  } else {
    messageContent = (
      <div className="mt-2">
        <AgentThinkingLoader />
      </div>
    )
  }

  return (
    <div className="flex flex-row items-start gap-4 font-geist">
      <div className="flex-shrink-0">
        <Icon type="agent" size="sm" />
      </div>
      {messageContent}
    </div>
  )
}

const UserMessage = memo(({ message }: MessageProps) => {
  return (
    <div className="flex items-start pt-4 text-start max-md:break-words">
      <div className="flex flex-row gap-x-3">
        <p className="flex items-center gap-x-2 text-sm font-medium text-muted">
          <Icon type="user" size="sm" />
        </p>
        <div className="text-md rounded-lg py-1 font-geist text-secondary">
          <MarkdownRenderer inline>{message.content}</MarkdownRenderer>
        </div>
      </div>
    </div>
  )
})

AgentMessage.displayName = 'AgentMessage'
UserMessage.displayName = 'UserMessage'
export { AgentMessage, UserMessage }
