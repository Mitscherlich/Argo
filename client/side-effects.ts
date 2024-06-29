import './style.scss'

import { loader } from '@monaco-editor/react'

import * as monaco from 'monaco-editor'

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

const constructorMap = new Map([
  ['json', JsonWorker],
  ['css', CssWorker],
  ['scss', CssWorker],
  ['less', CssWorker],
  ['html', HtmlWorker],
  ['handlebars', HtmlWorker],
  ['razor', HtmlWorker],
  ['typescript', TsWorker],
  ['javascript', TsWorker],
])

self.MonacoEnvironment = {
  getWorker(_, label) {
    const Worker = constructorMap.get(label) ?? EditorWorker
    return new Worker()
  },
}

loader.config({ monaco })
