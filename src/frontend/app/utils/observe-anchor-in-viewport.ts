import { ref, type Ref } from 'vue';

import { getScrollParent, MAIN_SCROLL_OFFSET } from './scrolling';

/**
 * Observe which anchor element (e.g. headings) is currently most visible in the
 * viewport of its scrollable parent.
 *
 * @returns An object containing:
 * - `activeAnchorId`: A reactive reference to the ID of the currently active anchor element.
 * - `startObserving`: A function to start observing the anchor elements. Optionally accepts an array of anchor elements to observe.
 * - `destroyAnchorObserver`: A function to stop observing the anchor elements.
 *
 * @throws {Error} Will throw an error if no anchor elements are provided or found.
 */
export function observeAnchorInViewport(): {
  activeAnchorId: Ref<string | undefined>;
  startObserving: (anchorElements?: HTMLElement[]) => void;
  destroyAnchorObserver: () => void;
} {
  const activeAnchorId = ref<string | undefined>(undefined);

  let observer: IntersectionObserver | undefined;

  const startObserving = (anchorElements: HTMLElement[] = []): void => {
    if (observer) return;

    if (anchorElements.length === 0) {
      anchorElements = [...window.document.querySelectorAll<HTMLElement>('[id^="heading__"]')];
    }

    if (anchorElements.length === 0) {
      throw new Error('No anchor elements found to observe.');
    }

    const scrollParent = getScrollParent(anchorElements[0]);

    observer = new IntersectionObserver(
      entries => {
        // Pick the most visible intersecting anchor
        const visibleAnchor = entries
          .filter(e => e.isIntersecting)
          .toSorted((a, b) => b.intersectionRatio - a.intersectionRatio)[0] as IntersectionObserverEntry | undefined;

        if (visibleAnchor) {
          const id = (visibleAnchor.target as HTMLElement).id;
          activeAnchorId.value = id;
          return;
        }

        // Fallback: choose the next TOP anchor (first anchor whose top is at or below the container's current top)
        const rootTop = scrollParent === window.document.documentElement ? 0 : scrollParent.scrollTop;
        let nextTopHeading: HTMLElement | undefined;
        let nextTopHeadingDelta = Number.POSITIVE_INFINITY;
        for (const anchor of anchorElements) {
          const delta = anchor.offsetTop - rootTop - MAIN_SCROLL_OFFSET;
          if (
            (delta <= 0 && (nextTopHeadingDelta > 0 || delta > nextTopHeadingDelta)) ||
            (delta > 0 && delta < nextTopHeadingDelta)
          ) {
            nextTopHeadingDelta = delta;
            nextTopHeading = anchor;
          }
        }
        // If none found (we scrolled past the last anchor), pick the last anchor
        const fallback = nextTopHeading ?? (anchorElements.at(-1) as HTMLElement);
        activeAnchorId.value = fallback.id;
      },
      {
        root: scrollParent,
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        threshold: [0, 0.5, 1],
        rootMargin: `0px 0px -50% 0px`,
      },
    );

    for (const el of anchorElements) {
      observer.observe(el);
    }
  };

  // Initialize from current location hash if present
  if (window.location.hash) {
    activeAnchorId.value = window.location.hash;
  }

  return {
    activeAnchorId,
    startObserving,
    destroyAnchorObserver: () => {
      observer?.disconnect();
      observer = undefined;
    },
  };
}
