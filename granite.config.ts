import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'common-sense',
  brand: {
    displayName: '당신의 상식은?', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#3182F6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: 'https://raw.githubusercontent.com/junotech-labs/game-web/77d721aded3d15a37c60bc77e7dc70a38783f938/public/logo.png', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
    bridgeColorMode: 'basic',
  },
  web: {
    host: '0.0.0.0',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
