import cache from './cache'
import modal from './modal'
import download from './download'
declare module 'vue' {
  interface ComponentCustomProperties {
      $modal: typeof modal;
      $cache: any;
      $download: typeof download;
  }
}
export default function installPlugins(app) {
  // 缓存对象
  app.config.globalProperties.$cache = cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 下载文件
  app.config.globalProperties.$download = download
}
