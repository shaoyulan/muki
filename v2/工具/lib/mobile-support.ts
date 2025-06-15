/**
 * @description 行動裝置開發相關支援 
 */

function install(){
  const root = document.querySelector("html");
  const windowInnerHeight = window.innerHeight + 'px';
  if(!root) return;
  root.style.setProperty('--window-inner-height', windowInnerHeight);

  if(CSS.supports('left:env(safe-area-inset-left)')){
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
    root.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
    root.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
  }else{
    root.style.setProperty('--safe-area-top', '0px');
    root.style.setProperty('--safe-area-right', '0px');
    root.style.setProperty('--safe-area-bottom', '0px');
    root.style.setProperty('--safe-area-left', '0px');
  }
}

export default {
  install
}

