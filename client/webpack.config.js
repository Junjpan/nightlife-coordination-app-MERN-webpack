const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const MiniCssExtractPlugin=require('mini-css-extract-plugin');

//const TerserPlugin=require('terser-webpack-plugin'); //minify javascript, uglify doesn't support ES6

/**
 * minimize:true,
        minimizer:[new TerserPlugin({
            test:/\.js(\?.*)?$/i,
            exclude:/node_modules/,
        })]
 */
module.exports={
    entry:{
        main:"./src/index.js"
    },
    output:{
        filename:"[name].[contentHash].js",
        path:path.resolve(__dirname,"build")
    },
    optimization:{//split chunks
        splitChunks:{
            cacheGroups:{
                commons:{
                    test:/[\\/]node_modules[\\/]/,
                    name:'vendors',
                    chunks:'all'
                }
            }
        }        
    },
    plugins:[new HtmlWebpackPlugin({
        template:'./src/index.html'
    }),
    new MiniCssExtractPlugin({filename:'[name].[hash].css'}),
    new CleanWebpackPlugin()],
    module:{
        rules:[{
            test:/\.html$/,
            use:{loader:"html-loader"}
        },
        {
            test:/\.css$/,
            use:[MiniCssExtractPlugin.loader,"css-loader"]
        },
        {
            test:/\.(js|jxs)$/i,
            exclude:/node_modules/,
            use:{loader:"babel-loader"}
        },
        {
            test:/\.(png|jpe?g|gif|svg)$/i,
            use:[{
                loader:"file-loader",
                options:{
                    name:'[name].[hash].[ext]',
                    outputPath:"./assets"
                }
            },{
                loader:"image-webpack-loader",
                options:{
                    bypassOnDebug:true,
                    mozjpeg:{
                        progressive:true,
                        quality:20,
                    },
                    webp:{
                        quality:50
                    }
                }
            }]
        }]
    }

}