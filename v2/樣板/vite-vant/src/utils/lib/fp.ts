import FingerprintJS from '@fingerprintjs/fingerprintjs';

let visitorId: string | null = null;

const fp = FingerprintJS.load().then(async fp => {
  const result = await fp.get();
  visitorId = result.visitorId;
  return visitorId;
})

export const getVisitorId = () => {
  if(!visitorId) {
    console.error("VisitorId 是空值，請等待FP生成後再執行Vue app.mount('#app')。或使用fp.then()取得VisitorId。");
  }
  return visitorId as string;
}

export default fp;