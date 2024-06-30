import React from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { axiosJson } from './helpers/request'
import { safeJsonParse } from './utils/common'
import LogsView from './components/logs'
import MonacoEditor from './components/monaco-editor'

interface ProxyOptions {
  target: string
  changeOrigin?: boolean
}

function App() {
  const [activeTab, setActiveTab] = useLocalStorageState<string>('activeTab', {
    defaultValue: 'config',
  })
  const [json, setJson] = useState('{}')
  useAsyncEffect(async () => {
    const { data } = await axiosJson.get('/api/config/get')
    setJson(JSON.stringify(data, null, 4))
  }, [])

  const { run: doSubmit, loading } = useRequest(async () => {
    await axiosJson.post('/api/config/save', safeJsonParse<Record<string, string | ProxyOptions>>(json, {}))
  }, {
    manual: true,
  })

  const { run: runTest } = useRequest(async () => {
    await fetch('/proxy/test')
  }, {
    manual: true,
  })

  return (
    <Container className="my-4">
      <Card>
        <Card.Header>
          <b>http-proxy-webui</b>
        </Card.Header>

        <Card.Body>
          <Tabs defaultActiveKey="config" activeKey={activeTab} onSelect={setActiveTab}>
            <Tab eventKey="config" title="编辑配置">
              <MonacoEditor value={json} onChange={setJson} />
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
              <LogsView />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default App
