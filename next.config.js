const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  plugins: [
    new MonacoWebpackPlugin()
  ]
}
