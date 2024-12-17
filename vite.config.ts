import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// 引入在vite中使用环境变量的插件，方便在index.html中使用.env文件变量
import { createHtmlPlugin } from "vite-plugin-html";
import * as fs from "fs";
import eslintPlugin from "vite-plugin-eslint";
import * as path from "path";
import {svgBuilder} from './src/icons';

// 这个配置 为了在html中使用 环境变量
const getViteEnv = (
  mode: string,
  target: string | number,
  loadPrefix?: string
) => loadEnv(mode, process.cwd(), loadPrefix)[target];
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseUrl = getViteEnv(mode, "VITE_APP_BASE_URL");
  const appConfigUrl = getViteEnv(mode, "VITE_APP_CONFIG_URL");
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            title:
              `${getViteEnv(mode, "VITE_APP_TITLE") 
              } ${ 
              getViteEnv(mode, "VITE_APP_TITLE_DESC")}`,
            baseUrl,
            baseSourceUrl: getViteEnv(mode, "VITE_APP_BASE_SOURCE_URL"),
            configFileUrl:
              mode === "development" ? baseUrl + appConfigUrl : appConfigUrl,
          },
        },
      }),
      eslintPlugin({
        include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
      }),
      svgBuilder('./src/icons/svg/'),
    ],
    resolve: {
      alias: [
        {
          find: "@", // 指向的是src目录
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          charset: false,
          // 需要在assets下创建对应的文件global.scss
          additionalData: '@import "./src/assets/style/global.scss";',
        },
      },
    },
    // 自动打开浏览器
    server: {
      host: "https://0.0.0.0", // 通过ip的形式访问
      port: 8080, // 端口号
      https: {
        cert: fs.readFileSync(path.join(__dirname, "keys/cert.crt")),
        key: fs.readFileSync(path.join(__dirname, "keys/cert.key")),
      },
      open: true, // 自动打开浏览器
      // 配置代理，开发环境前端去代理，生产环境不行
      // proxy: {
      //   "/api": {
      //     target: "musicapi.atian.work",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
      // },
    },
  };
});
