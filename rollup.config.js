import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  dest: 'dest/index.js',
  format: 'cjs',
  plugins: [
    babel({
      runtimeHelpers: true
    })
  ]
}
