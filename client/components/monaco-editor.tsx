import React from 'react'
import type * as monaco from 'monaco-editor'
import Editor from '@monaco-editor/react'

interface MonacoEditorProps {
  value: string
  onChange: (val: string) => void
}

const MonacoEditor: React.FC<MonacoEditorProps> = (props) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  const [value, setValue] = useControllableValue(props, {
    valuePropName: 'value',
    defaultValue: '{}',
    defaultValuePropName: 'defaultValue',
    trigger: 'onChange',
  })

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

  return (
    <Editor
      className="my-2"
      height={300}
      value={value}
      language="json"
      theme="vs-dark"
      onMount={handleEditorDidMount}
      onChange={setValue}
    />
  )
}

export default MonacoEditor
