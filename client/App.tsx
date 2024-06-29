import React from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import type * as monaco from 'monaco-editor'
import Editor from '@monaco-editor/react'
import { SSE, axiosJson } from './helpers/request'
import { safeJsonParse } from './utils/common'

interface ProxyOptions {
  target: string
  changeOrigin?: boolean
}

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

function App() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  const [activeTab, setActiveTab] = useLocalStorageState<string>('activeTab', {
    defaultValue: 'config',
  })
  const [json, setJson] = useState('{}')
  useAsyncEffect(async () => {
    const { data } = await axiosJson.get('/api/config/get')
    setJson(JSON.stringify(data, null, 4))
  }, [])

  function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) {
    editorRef.current = editor

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      schemas: [{
        uri: 'http://m9ch.cn/http-proxy-middleware/schema#',
        fileMatch: [`${editor.getModel().uri}`],
        schema: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              {
                type: 'string',
              },
              {
                type: 'object',
                properties: {
                  target: {
                    type: 'string',
                  },
                  changeOrigin: {
                    type: 'boolean',
                  },
                },
                required: ['target'],
                additionalProperties: false,
              },
            ],
          },
        },
      }],
    })
  }

  const { run: doSubmit, loading } = useRequest(async () => {
    await axiosJson.post('/api/config/save', safeJsonParse<Record<string, string | ProxyOptions>>(json, {}))
  }, {
    manual: true,
  })

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

  const { run: runTest } = useRequest(async () => {
    await fetch('/proxy/test')
  })

  return (
    <>
      <Container className="my-4">
      <Card>
        <Card.Header>
          <b>http-proxy-webui</b>
        </Card.Header>

        <Card.Body>
          <Tabs defaultActiveKey="config" activeKey={activeTab} onSelect={setActiveTab}>
            <Tab eventKey="config" title="编辑配置">
              <Editor
                className="my-2"
                height={300}
                value={json}
                language="json"
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={setJson}
              />
              <div className="d-flex gap-1">
                <Button variant="outline-success" disabled={loading} onClick={doSubmit}>
                  {loading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  保存
                </Button>

                <Button variant='outline-primary' onClick={runTest}>测试</Button>
              </div>
            </Tab>

            <Tab eventKey="logs" title="日志">
              <pre className="py-3" style={{ minHeight: '50vh' }}>
                {lines.map((line, index) => (
                  <p key={`line-${index}`} className="mb-1">
                    {line}
                  </p>
                ))}
              </pre>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
    </>
  )
}

export default App
