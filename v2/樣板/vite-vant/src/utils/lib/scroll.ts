

/**
 * @description 水平捲動元素至中心
 */
export function scrollElementXCenter(parentElement: HTMLElement, targetElement: HTMLElement, ) {
  const parentWidth = parentElement.clientWidth;
  const targetWidth = targetElement.clientWidth;
  const targetLeft = targetElement.offsetLeft;
  const targetCenter = targetLeft + targetWidth / 2;
  parentElement.scrollTo({
    left: targetCenter - parentWidth / 2,
    behavior: 'smooth',
  });
}