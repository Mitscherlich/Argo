import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [{ input: './server/', format: 'cjs', ext: 'js' }],
  outDir: './output',
  clean: true,
  sourcemap: false,
  declaration: false,
})
