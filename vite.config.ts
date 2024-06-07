
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"; // 按需组件自动导入
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import postcsspxtoviewport from "postcss-px-to-viewport"
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({

  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: "px", // 要转化的单位
          viewportWidth: 1920, // UI设计稿的宽度
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
  base: './',
  build: {
    target: "esnext",
    rollupOptions: {
      external: /\.skel$/,
    },
    assetsDir: 'public',
  },
  preview: {
    host: true,
    port: 8080,
  },

  plugins: [vue(), Components({
    dts: true, //生成components.d.ts 全局定义文件
    resolvers: [
      AntDesignVueResolver({ //对使用到的全局ant design vue组件进行类型导入
        importStyle: false,  // 不动态引入css,这个不强求
      }),
    ],
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx$/], //包含的文件类型
  }),
  AutoImport({
    // targets to transform
    include: [
      /\.[tj]sx?$/,
      /\.vue$/,
      /\.vue\?vue/,
      /\.md$/,
    ],
    imports: [
      'vue',
      'vue-router',
      'pinia'
    ],
    eslintrc: {
      enabled: false, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    dts: './auto-imports.d.ts',
  })
  ],

  server: {
    port: 9000,
    proxy: {
      '/api': {
        target: 'https://kj.fangtian.me/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  },
})

