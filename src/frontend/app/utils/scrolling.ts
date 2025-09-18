/**
 * Offset from the top when scrolling to an element in the main view.
 * (nav height + gut feeling)
 */
export const MAIN_SCROLL_OFFSET = 80;

/**
 * Get the nearest scrollable parent element of a given element.
 *
 * @param element - The element to find the scrollable parent for.
 * @returns The nearest scrollable parent element, or the document scrolling element.
 */
export function getScrollParent(element: Element): HTMLElement {
  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (/(auto|scroll|overlay)/.test(overflowY)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return (window.document.scrollingElement as HTMLElement | null) ?? window.document.documentElement;
}
