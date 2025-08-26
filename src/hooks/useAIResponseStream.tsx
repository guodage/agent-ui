import { useCallback } from 'react'
import { type RunResponse } from '@/types/playground'

/**
 * Processes a single JSON chunk by passing it to the provided callback.
 * @param chunk - A parsed JSON object of type RunResponse.
 * @param onChunk - Callback to handle the chunk.
 */
function processChunk(
  chunk: RunResponse,
  onChunk: (chunk: RunResponse) => void
) {
  onChunk(chunk)
}

/**
 * Parses a string buffer to extract complete JSON objects.
 *
 * This function discards any extraneous data before the first '{', then
 * repeatedly finds and processes complete JSON objects.
 *
 * @param text - The accumulated string buffer.
 * @param onChunk - Callback to process each parsed JSON object.
 * @returns Remaining string that did not form a complete JSON object.
 */
/**
 * Extracts complete JSON objects from a buffer string **incrementally**.
 * - It allows partial JSON objects to accumulate across chunks.
 * - It ensures real-time streaming updates.
 */
function parseBuffer(
  buffer: string,
  onChunk: (chunk: RunResponse) => void
): string {
  let jsonStartIndex = buffer.indexOf('{')
  let jsonEndIndex = -1
  let parsedCount = 0
  let skippedBytes = 0

  while (jsonStartIndex !== -1) {
    let braceCount = 0
    let inString = false
    let escaped = false

    // Iterate through the buffer to find the end of the JSON object
    for (let i = jsonStartIndex; i < buffer.length; i++) {
      const char = buffer[i]
      const prevChar = i > 0 ? buffer[i - 1] : ''

      // Handle escape sequences properly
      if (inString) {
        if (escaped) {
          escaped = false
        } else if (char === '\\') {
          escaped = true
        } else if (char === '"') {
          inString = false
        }
      } else {
        if (char === '"') {
          inString = true
        } else if (char === '{') {
          braceCount++
        } else if (char === '}') {
          braceCount--
        }
      }

      // If the brace count is 0, we have found the end of the JSON object
      if (braceCount === 0 && !inString) {
        jsonEndIndex = i
        break
      }
    }

    // If we found a complete JSON object, process it
    if (jsonEndIndex !== -1) {
      const jsonString = buffer.slice(jsonStartIndex, jsonEndIndex + 1)
      try {
        const parsed = JSON.parse(jsonString) as RunResponse
        parsedCount++
        
        if (parsedCount <= 5) {
          // JSON解析成功
        }
        
        processChunk(parsed, onChunk)
      } catch (parseError) {
        console.warn('JSON解析失败:', parseError instanceof Error ? parseError.name : 'Unknown');
        
        // 尝试跳过这个有问题的JSON，继续处理后面的数据
        skippedBytes += jsonEndIndex - jsonStartIndex + 1
        
        // 如果累计跳过的字节数过多，可能整个数据流都有问题
        if (skippedBytes > 10000) {
          console.error('跳过字节数过多，可能整个数据流损坏');
          break
        }
      }
      buffer = buffer.slice(jsonEndIndex + 1).trim()
      jsonStartIndex = buffer.indexOf('{')
      jsonEndIndex = -1
    } else {
      // No complete JSON found, wait for the next chunk
      if (buffer.length > 0) {
        // 等待更多数据完成JSON
      }
      break
    }
  }

  if (skippedBytes > 0) {
    console.warn('解析完成，跳过了部分损坏数据');
  }

  return buffer
}

/**
 * Custom React hook to handle streaming API responses as JSON objects.
 *
 * This hook:
 * - Accumulates partial JSON data from streaming responses.
 * - Extracts complete JSON objects and processes them via onChunk.
 * - Handles errors via onError and signals completion with onComplete.
 *
 * @returns An object containing the streamResponse function.
 */
export default function useAIResponseStream() {
  const streamResponse = useCallback(
    async (options: {
      apiUrl: string
      headers?: Record<string, string>
      requestBody: FormData | Record<string, unknown>
      onChunk: (chunk: RunResponse) => void
      onError: (error: Error) => void
      onComplete: () => void
    }): Promise<void> => {
      const {
        apiUrl,
        headers = {},
        requestBody,
        onChunk,
        onError,
        onComplete
      } = options

      // Buffer to accumulate partial JSON data.
      let buffer = ''
      let chunkCount = 0
      let totalBytes = 0
      const startTime = Date.now()
      
      // 开始流式连接

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            // Set content-type only for non-FormData requests.
            ...(!(requestBody instanceof FormData) && {
              'Content-Type': 'application/json'
            }),
            ...headers
          },
          body:
            requestBody instanceof FormData
              ? requestBody
              : JSON.stringify(requestBody)
        })
        
        // 收到响应

        if (!response.ok) {
          const errorData = await response.json()
          throw errorData
        }

        if (!response.body) {
          throw new Error('No response body')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        // Recursively process the stream.
        const processStream = async (): Promise<void> => {
          const readStartTime = Date.now()
          
          try {
            const { done, value } = await reader.read()
            
            const readDuration = Date.now() - readStartTime
            if (readDuration > 5000) {
              // 慢速读取检测
            }
            
            if (done) {
              // 流式传输完成
              
              // Process any final data in the buffer.
              if (buffer.trim()) {
                // 处理剩余buffer
                
                // 尝试多次解析剩余buffer，直到无法解析更多内容
                let previousBufferLength = buffer.length
                let attemptCount = 0
                const maxAttempts = 5
                
                while (buffer.trim() && attemptCount < maxAttempts) {
                  attemptCount++
                  buffer = parseBuffer(buffer, onChunk)
                  
                  if (buffer.length === previousBufferLength) {
                    // 如果buffer长度没有变化，说明无法继续解析
                    // 无法继续解析剩余buffer
                    break
                  }
                  
                  previousBufferLength = buffer.length
                  
                  if (attemptCount > 1) {
                    // 第${attemptCount}次解析剩余buffer
                  }
                }
                
                // 如果仍有剩余内容无法解析，记录详细信息
                if (buffer.trim()) {
                  console.error('最终仍有无法解析的数据');
                }
              }
              
              onComplete()
              return
            }
            
            chunkCount++
            const chunkSize = value?.length || 0
            totalBytes += chunkSize
            
            if (chunkCount <= 10 || chunkCount % 50 === 0) {
              // 定期记录进度
            }
            
            // Decode, sanitize, and accumulate the chunk
            const decodedChunk = decoder.decode(value, { stream: true })
            buffer += decodedChunk

            // Parse any complete JSON objects available in the buffer.
            const previousBufferLength = buffer.length
            buffer = parseBuffer(buffer, onChunk)
            
            if (buffer.length !== previousBufferLength && chunkCount <= 10) {
              // Buffer状态记录
            }
            
            await processStream()
          } catch (readError) {
            console.error('读取chunk错误:', readError);
            throw readError
          }
        }
        await processStream()
      } catch (error) {
        console.error('流式连接错误:', error instanceof Error ? error.message : String(error));
        
        if (typeof error === 'object' && error !== null && 'detail' in error) {
          onError(new Error(String(error.detail)))
        } else {
          onError(new Error(String(error)))
        }
      }
    },
    []
  )

  return { streamResponse }
}
