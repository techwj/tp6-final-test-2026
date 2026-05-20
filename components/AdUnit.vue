<template>
  <ClientOnly>
    <div>
      <!-- GPT ads -->
      <div v-if="type === 'gpt'" :id="gptAdId" :style="gptStyle"></div>
      <!-- AdSense ads -->
      <ins
        v-else-if="type === 'adsense' && adConfig"
        :key="`${adConfig.slot}-${route.fullPath}`"
        ref="adInsRef"
        class="adsbygoogle"
        :style="adConfig.format === 'auto' ? 'display:block' : `display:inline-block;width:${adConfig.width}px;height:${adConfig.height}px`"
        :data-ad-client="adConfig.client"
        :data-ad-slot="adConfig.slot"
        v-bind="adConfig.format === 'auto' ? { 'data-ad-format': 'auto', 'data-full-width-responsive': adConfig.fullWidthResponsive ? 'true' : undefined } : {}"
      ></ins>
    </div>
  </ClientOnly>
</template>

<script setup>
/**
 * 
 * usage:
 * 
 * <AdUnit
  type="gpt"
  gptAdId="HK_CN_58information_vip_banner_5"
  gptSlot="/29746187,23103910451/HK_CN_58information.vip_banner_5"
  :gptSlotSizes="[[300,250]]"
  :gptSizeMappings="[
    { viewport: [728, 300], sizes: [] },
    { viewport: [0, 0], sizes: [[300,250]] }
  ]"
  gptStyle="text-align:center;min-width:300px;height:250px"
/>
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * <AdUnit
  type="adsense"
  :configs="[
    { min: 1000, client: 'ca-pub-6642330019857482', slot: '3856903777', width: 1080, height: 250 }, // PC
    { min: 500, client: 'ca-pub-6642330019857482', slot: '1805455508', width: 400, height: 150 },  // tablet
    { min: 0, client: 'ca-pub-6642330019857482', slot: '9434881128', width: 320, height: 150 }      // mobile
  ]"
/>

// auto format
// <AdUnit
//   type="adsense"
//   :configs="[
//     { min: 0, client: 'ca-pub-6642330019857482', slot: '2640637409', format: 'auto', fullWidthResponsive: true }
//   ]"
// />
 * 
 * 
 * 
 * 
 * 
 * 
 */




import { ref, onMounted, onUnmounted, watch, nextTick, onBeforeUpdate, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAds } from '~/composables/useAds'

const props = defineProps({
  type: { type: String, default: 'adsense' }, // 'gpt' or 'adsense'
  // GPT ads parameters
  gptAdId: { type: String, default: 'gpt-ad-1' },
  gptSlot: { type: String, default: '' },
  gptStyle: { type: String, default: 'text-align:center;min-width:320px;height:150px' },
  gptSlotSizes: { type: Array, default: () => [[300, 150]] },
  gptSizeMappings: {
    type: Array,
    default: () => [
      { viewport: [728, 300], sizes: [] },
      { viewport: [0, 0], sizes: [[300, 150]] }
    ]
  },
  // AdSense responsive configuration
  configs: {
    type: Array,
    default: () => [
      // 固定尺寸广告示例
      { min: 1000, client: 'ca-pub-6642330019857482', slot: '6508323125', width: 1080, height: 250 },
      { min: 500, client: 'ca-pub-6642330019857482', slot: '6508323125', width: 400, height: 150 },
      { min: 0, client: 'ca-pub-6642330019857482', slot: '6508323125', width: 320, height: 150 },
      // 自适应广告示例
      // { min: 0, client: 'ca-pub-6642330019857482', slot: '2640637409', format: 'auto', fullWidthResponsive: true }
    ]
    /*
      configs: Array<{
        min: number, // 屏幕宽度下限
        client: string, // adsense client id
        slot: string,   // adsense slot id
        width?: number, // 固定宽度（可选）
        height?: number, // 固定高度（可选）
        format?: string, // 广告格式，如 'auto'（可选，自适应广告）
        fullWidthResponsive?: boolean // 是否全宽自适应（可选，配合format:'auto'）
      }>
    */
  }
})

const adConfig = ref(null)
const adInsRef = ref(null)
const { loadGPTScript, initGPTAd, destroyGPTAd, loadAdScript, initAdScript } = useAds()
const route = useRoute()
const isAdInitialized = ref(false)
const isScriptLoaded = ref(false)
const isScriptLoading = ref(false)
const scriptLoadRetryCount = ref(0)
const maxRetries = 5

function pickAdConfig() {
  const width = window.innerWidth
  adConfig.value = props.configs
    .sort((a, b) => b.min - a.min)
    .find(cfg => width >= cfg.min)
  isAdInitialized.value = false
}

function removeOtherAds(currentIns) {
  const allAds = document.querySelectorAll('ins.adsbygoogle');
  allAds.forEach(ins => {
    if (ins !== currentIns && !ins.hasAttribute('data-ad-slot')) {
      ins.parentNode && ins.parentNode.removeChild(ins);
    }
  });
}

// 清理广告函数
function cleanupAd() {
  const currentIns = adInsRef.value;
  if (currentIns) {
    // 移除广告状态
    if (currentIns.hasAttribute('data-adsbygoogle-status') ||
        currentIns.hasAttribute('data-ad-status') ||
        currentIns.innerHTML.trim() !== '') {
      currentIns.removeAttribute('data-adsbygoogle-status');
      currentIns.removeAttribute('data-ad-status');
      // 清空内容
      currentIns.innerHTML = '';
      console.log('adunit>cleanup>ad removed', {
        slot: adConfig.value?.slot,
        route: route.fullPath
      });
    }
  }
  // 重置状态
  isScriptLoaded.value = false;
  isAdInitialized.value = false;
  scriptLoadRetryCount.value = 0;
}

async function initAd() {
  const currentPath = route.fullPath;
  const currentIns = adInsRef.value;

  // 先检查元素是否存在
  if (!currentIns) {
    console.log('adunit>initad>waiting for ins element');
    await nextTick();
    if (!adInsRef.value) {
      console.log('adunit>initad>no ins element after tick');
      return;
    }
  }

  console.log('adunit>initad>start', {
    hasIns: !!adInsRef.value,
    hasAdsbygoogle: !!window.adsbygoogle,
    isInitialized: isAdInitialized.value,
    isScriptLoading: isScriptLoading.value,
    retryCount: scriptLoadRetryCount.value,
    path: currentPath
  });

  // 检查是否已经有广告
  const hasAd = currentIns.hasAttribute('data-adsbygoogle-status') || 
                currentIns.hasAttribute('data-ad-status') ||
                currentIns.innerHTML.trim() !== '';
                
  if (hasAd) {
    console.log('adunit>initad>ad already exists', {
      slot: adConfig.value?.slot,
      path: currentPath
    });
    return;
  }

  // 等待脚本加载完成
  if (!window.adsbygoogle) {
    while (scriptLoadRetryCount.value < maxRetries) {
      if (!isScriptLoaded.value && !isScriptLoading.value) {
        isScriptLoading.value = true;
        try {
          await loadAdScript(adConfig.value?.client);
          await new Promise(resolve => setTimeout(resolve, 200));
          
          if (window.adsbygoogle) {
            isScriptLoaded.value = true;
            console.log('adunit>initad>script loaded successfully');
            break;
          }
        } finally {
          isScriptLoading.value = false;
        }
      }
      
      console.log('adunit>initad>waiting for script', { 
        retryCount: scriptLoadRetryCount.value,
        hasAdsbygoogle: !!window.adsbygoogle,
        path: currentPath
      });
      
      scriptLoadRetryCount.value++;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (!window.adsbygoogle) {
      console.log('adunit>initad>script load failed after retries');
      return;
    }
  }

  console.log('adunit>initad>ready to push ad', {
    hasAdsbygoogle: true,
    isInitialized: isAdInitialized.value,
    slot: adConfig.value?.slot,
    path: currentPath
  });
  
  try {
    // 确保 adsbygoogle 数组存在并推送新广告
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
    isAdInitialized.value = true;
    console.log('adunit>initad>pushed new ad', {
      slot: adConfig.value?.slot,
      path: currentPath,
      isInitialized: true
    });
  } catch (error) {
    console.error('Failed to initialize ad:', error);
    isAdInitialized.value = false;
  }
}

// 监听路由变化
watch(() => route.fullPath, async (newPath, oldPath) => {
  if (props.type === 'adsense') {
    console.log('adunit>route changed', { 
      from: oldPath,
      to: newPath,
      isInitialized: isAdInitialized.value
    });
    cleanupAd();
  }
});

onMounted(async () => {
  if (props.type === 'gpt') {
    console.log('adunit>onmounted>gpt');
    await loadGPTScript();
    await nextTick();
    await initGPTAd(props.gptAdId, props.gptSlot, props.gptSlotSizes, props.gptSizeMappings);
  } else {
    console.log('adunit>onmounted>adsense');
    pickAdConfig();
    await nextTick();
    await initAd();
  }
});

// 在组件即将更新前清理
onBeforeUpdate(() => {
  if (props.type === 'adsense') {
    console.log('adunit>before update');
    cleanupAd();
  }
});

// 在组件即将卸载前清理
onBeforeUnmount(() => {
  if (props.type === 'gpt') {
    destroyGPTAd(props.gptAdId);
  } else {
    console.log('adunit>before unmount');
    cleanupAd();
    window.removeEventListener('resize', pickAdConfig);
  }
});
</script>