const path = require('path')
module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		filename: 'vue-ui.js',
		path: path.resolve(__dirname, './dist'),
		library: 'util', // 暴露的变量
		libraryTarget: 'umd' // 支持的方案，一般填这个就行
	},
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.js$/,
	// 			exclude: /node_modules/,
	// 			use: ['babel-loader']
	// 		}
	// 	]
  // },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  externals: {
    'element-ui': 'element-ui'
  }
}