import cache from './cache'
import modal from './modal'
import download from './download'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
      $modal: any; // 这里填类型
      $cache: any;
      $download: any;
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
