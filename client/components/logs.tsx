import React from 'react'
import { styled } from 'styled-components'
import { SSE } from '../helpers/request'

async function *readline(stream) {
  const decoder = new TextDecoderStream()
  const reader = stream.pipeThrough(decoder).getReader()
  for (;;) {
    const { value, done } = await reader.read()
    if (done)
      break

    const newLines = value.split('\n').reverse()
    for (const line of newLines)
      yield line
  }
}

const LogsWrapper = styled.pre`
  display: flex;
  flex-direction: column;
  min-height: 50vh;
`

const LogDetails = styled.code`
  flex: 1;
  overflow: auto;
  height: 0;
  min-width: 100%;
  width: max-content;
`

const LogsRow = styled.p`
  margin: 0;
  line-height: 2;
  min-width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

const LogsView: React.FC = () => {
  const [lines, setLines] = useState<string[]>([])
  useAsyncEffect(async () => {
    const { data } = await SSE('/api/log/stream')
    for await (const line of readline(data)) {
      if (line)
        setLines(lines => [line, ...lines])

      if (lines.length >= 100)
        setLines(lines => lines.toSpliced(0, 100))
    }
  }, [])

  return (
    <LogsWrapper className="py-3">
      <LogDetails>
        {lines.length > 0
          ? lines.map((line, index) => (
            <LogsRow key={`line-${index}`}>
              {line}
            </LogsRow>
          ))
          : <span>没有日志</span>}
      </LogDetails>
    </LogsWrapper>
  )
}

export default LogsView
