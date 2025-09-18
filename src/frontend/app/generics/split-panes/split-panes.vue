<!--————————————————————————————————————————————————————————————————————————————

# SplitPanes — Flexible multi‑pane splitter

## Features

- Horizontal (side‑by‑side) or vertical (stacked) panes
- Any number of panes
- Resizable via draggable gutters (mouse, touch, trackpad)
- Min size per pane, responsive percentages
- v-model:sizes for two‑way binding and easy persistence
- Emits: update:sizes, drag-start, drag, drag-end

## Usage

### Two panes side by side (with model, stored)

```vue
<script setup lang="ts">
  import SplitPanes from './split-panes.vue';
  import useSplitPanesStore from './split-panes-store';

  const splitPanesStore = useSplitPanesStore();
  const paneSizes = splitPanesStore.itemRef('myPanes', [30, 70]);
</script>
<template>
  <SplitPanes v-model:sizes="paneSizes" direction="horizontal">
    <template #pane0><ExplorerView /></template>
    <template #pane1><EditorView /></template>
  </SplitPanes>
</template>

```

### Three panes stacked (without model, unstored, using defaults)
```vue
<SplitPanes direction="vertical" :sizes="[0, 0, 0]">
  <template #pane0><ConsolePanel /></template>
  <template #pane1><MainPanel /></template>
  <template #pane2><LogsPanel /></template>
</SplitPanes>
```

—————————————————————————————————————————————————————————————————————————————-->

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const PERCENT_MAX = 100;
const PANE_SIZE_MIN = 0.0001; // never 0, else layout glitches
const THREE_DIGITS_FACTOR = 1000;
const THREE_DIGITS_MIN = 0.001;

type Dir = 'horizontal' | 'vertical';

interface Props {
  /**
   * Layout direction:
   * - "horizontal" → panes side by side (vertical gutters)
   * - "vertical"   → panes stacked (horizontal gutters)
   */
  direction?: Dir;

  /**
   * Percentage sizes per pane. Must match the number of panes, sum ≈ 100.
   * If omitted, sizes are evenly distributed.
   */
  sizes?: number[];

  /**
   * Minimum size per pane in percent (globally or per pane).
   */
  minSize?: number | number[];
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  sizes: undefined,
  minSize: 5,
});

const emit = defineEmits<{
  (e: 'update:sizes', value: number[]): void;
  (e: 'drag-start' | 'drag' | 'drag-end', detail: { index: number; sizes: number[] }): void;
}>();

/**
 * Number of panes = count of slots named pane-0..N-1.
 * Since <slot> cannot be counted at runtime, we derive it from `sizes` or assume 2.
 * In practice, provide `sizes` with the correct length.
 */
const paneCount = computed(() => props.sizes?.length ?? 2);

const root = ref<HTMLElement>();

const internalSizes = ref<number[]>(
  props.sizes && props.sizes.length === paneCount.value
    ? normalizeTo100(props.sizes)
    : Array.from({ length: paneCount.value }, () => PERCENT_MAX / paneCount.value),
);

watch(
  () => props.sizes,
  next => {
    if (next && next.length === paneCount.value) {
      internalSizes.value = normalizeTo100(next);
    }
  },
);

const dirClass = computed(() => (props.direction === 'horizontal' ? 'sp-row' : 'sp-col'));

/**
 * Get style object for a pane to set its flex grow and min size.
 *
 * @param index - Pane index
 * @returns Style object for the pane (flex grow, min size)
 */
function paneStyle(index: number): Record<string, string | undefined> {
  const grow = Math.max(internalSizes.value[index], PANE_SIZE_MIN);
  return {
    flex: `${grow} 1 0`,
    minWidth: props.direction === 'horizontal' ? '0' : undefined,
    minHeight: props.direction === 'vertical' ? '0' : undefined,
  };
}

let dragIndex = -1;
let startPos = 0;
let startSizes: number[] = [];
let pxPerPercent = 1; // pixels per percentage point (depends on container size without gutters)

/**
 * Handle pointer down on a gutter to start dragging.
 *
 * @param event - Pointer event
 * @param index - Gutter index (left/top pane)
 */
function onPointerDown(event: PointerEvent, index: number): void {
  if (!root.value) return;
  // Pointer capture for clean dragging (even when the cursor leaves the gutter)
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);

  dragIndex = index;
  startPos = getCoord(event);
  startSizes = [...internalSizes.value];
  pxPerPercent = computePxPerPercent();

  globalThis.document.body.classList.add('sp-dragging', `sp-dragging--${props.direction}`);
  globalThis.addEventListener('pointermove', onPointerMove, { passive: false });
  globalThis.addEventListener('pointerup', onPointerUp);
  globalThis.addEventListener('pointercancel', onPointerUp);

  emit('drag-start', { index, sizes: [...internalSizes.value] });
}

/**
 * Handle pointer move events during dragging.
 *
 * @param event - Pointer event
 */
function onPointerMove(event: PointerEvent): void {
  if (dragIndex < 0) return;
  event.preventDefault(); // prevents unwanted scrolling in touch/trackpad scenarios

  const deltaPx = getCoord(event) - startPos;
  const deltaPercent = deltaPx / pxPerPercent;

  const left = clamp(startSizes[dragIndex] + deltaPercent, getMin(dragIndex), PERCENT_MAX);
  const right = clamp(startSizes[dragIndex + 1] - deltaPercent, getMin(dragIndex + 1), PERCENT_MAX);

  // Only adjust the two adjacent panes; the rest stay unchanged.
  const sumPair = left + right;
  const sumOriginalPair = startSizes[dragIndex] + startSizes[dragIndex + 1];

  // Keep the total ≈ 100 by scaling the pair proportionally.
  const scale = sumOriginalPair > 0 ? sumOriginalPair / sumPair : 1;
  const nextLeft = left * scale;
  const nextRight = right * scale;

  const next = [...internalSizes.value];
  next[dragIndex] = nextLeft;
  next[dragIndex + 1] = nextRight;

  // Micro correction so the sum is exactly 100 (floating point)
  internalSizes.value = normalizeTo100(next);
  emit('update:sizes', [...internalSizes.value]);
  emit('drag', { index: dragIndex, sizes: [...internalSizes.value] });
}

/**
 * Handle pointer up to end dragging.
 */
function onPointerUp(): void {
  if (dragIndex < 0) return;
  dragIndex = -1;
  globalThis.document.body.classList.remove('sp-dragging', 'sp-dragging--horizontal', 'sp-dragging--vertical');
  globalThis.removeEventListener('pointermove', onPointerMove);
  globalThis.removeEventListener('pointerup', onPointerUp);
  globalThis.removeEventListener('pointercancel', onPointerUp);
  emit('update:sizes', [...internalSizes.value]);
  emit('drag-end', { index: dragIndex, sizes: [...internalSizes.value] });
}

/**
 * Compute pixels per percentage point based on the current size of the container.
 *
 * @returns Pixels per percentage point
 */
function computePxPerPercent(): number {
  if (!root.value) return 1;
  const rect = root.value.getBoundingClientRect();
  const axisSize = props.direction === 'horizontal' ? rect.width : rect.height;
  return Math.max(axisSize / PERCENT_MAX, 1); // px per percentage point
}

/**
 * Get coordinate from event depending on direction.
 *
 * @param event - Pointer event
 * @returns X or Y coordinate depending on direction
 */
function getCoord(event: PointerEvent): number {
  return props.direction === 'horizontal' ? event.clientX : event.clientY;
}

/**
 * Get the minimum size for pane `i` from props.
 *
 * @param index - Pane index
 * @returns Minimum size in percent (default 0)
 */
function getMin(index: number): number {
  return Array.isArray(props.minSize) ? (props.minSize[index] ?? 0) : props.minSize;
}

/**
 * Clamp value between min and max, ensuring min ≤ max.
 *
 * @param value - The value to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Normalize an array of sizes so they sum to 100 (or are evenly distributed if all zero).
 * Rounds to 3 decimals and corrects the largest segment to ensure the total is exactly 100.
 *
 * @param sizes - Array of sizes (percent)
 * @returns Normalized sizes (sum = 100)
 */
function normalizeTo100(sizes: number[]): number[] {
  const sum = sizes.reduce((a, b) => a + b, 0);
  if (sum === 0) return Array.from({ length: sizes.length }, () => PERCENT_MAX / sizes.length);
  const scaled = sizes.map(v => (v / sum) * PERCENT_MAX);

  // Round to 3 decimals and fix the remainder to be exactly 100
  const rounded = scaled.map(v => Math.max(0, Math.round(v * THREE_DIGITS_FACTOR) / THREE_DIGITS_FACTOR));
  const diff = PERCENT_MAX - rounded.reduce((a, b) => a + b, 0);
  if (Math.abs(diff) > THREE_DIGITS_MIN) {
    // Correct on the largest segment to minimize distortion
    let idx = 0;
    for (let i = 1; i < rounded.length; i++) if (rounded[i] > rounded[idx]) idx = i;
    rounded[idx] = Math.max(0, rounded[idx] + diff);
  }
  return rounded;
}

onBeforeUnmount(() => {
  onPointerUp();
});
</script>

<template>
  <div class="sp-root" @pointerup="onPointerUp" @pointercancel="onPointerUp" ref="root" :class="dirClass">
    <template v-for="(_pane, i) in paneCount" :key="`pane-${i}`">
      <div class="sp-pane" :style="paneStyle(i)">
        <slot :name="`pane${i}`" />
      </div>
      <div class="sp-gutter" v-if="i < paneCount - 1" :class="dirClass">
        <div class="sp-gutter-handle" @pointerdown="e => onPointerDown(e, i)"></div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

$cursor--horizontal: ew-resize;
$cursor--vertical: ns-resize;

.sp-root {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sp-row {
  flex-direction: row;
}

.sp-col {
  flex-direction: column;
}

.sp-pane {
  position: relative;
  min-width: 0; /* important for horizontal layouts so content can shrink */
  min-height: 0; /* important for vertical layouts */
  overflow: auto; /* let content scroll, not the overall layout */
}

$gutter-handle-size: 4px;

/* Gutter/Button */
.sp-gutter {
  flex: 0 0 auto;
  background: rgba(255, 0, 0, 0);
  position: relative;
  z-index: 1;

  > .sp-gutter-handle {
    position: absolute;
  }

  &:hover > .sp-gutter-handle {
    background: var(--border-color--accent-muted);
  }

  &.sp-row {
    width: 0;
    cursor: $cursor--horizontal;

    > .sp-gutter-handle {
      top: 0;
      left: (math.div($gutter-handle-size, 2) * -1);
      width: $gutter-handle-size;
      height: 100%;
    }
  }

  &.sp-col {
    height: 0;
    cursor: $cursor--vertical;

    > .sp-gutter-handle {
      top: (math.div($gutter-handle-size, 2) * -1);
      left: 0;
      width: 100%;
      height: $gutter-handle-size;
    }
  }
}

/* During dragging, globally prevent text selection & overscroll */
:global(body.sp-dragging) {
  user-select: none !important;
  overscroll-behavior: none !important;
}

:global(body.sp-dragging--horizontal) {
  cursor: $cursor--horizontal !important;
}

:global(body.sp-dragging--vertical) {
  cursor: $cursor--vertical !important;
}

:global(body.sp-dragging *) {
  cursor: inherit !important;
}
</style>
