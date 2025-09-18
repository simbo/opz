<script setup lang="ts">
const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const sizes = ['s', 'm', 'l'];
</script>
<template>
  <template v-for="size in sizes" :key="size">
    <h3>
      <code>.content-flow.gap--{{ size }}</code>
    </h3>
    <div :class="`content-flow gap--${size}`">
      <p>
        This is a paragraph demonstrating the <code>.content-flow</code> class with the modifier
        <code>.gap--{{ size }}</code
        >.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi, laborum saepe quae quibusdam exercitationem vel
        beatae incidunt consequatur dolorum debitis, numquam libero similique. Sint veniam enim eos, nam quod sapiente?
      </p>
      <template v-for="heading in headings" :key="heading">
        <component :is="heading">This is a {{ heading.toUpperCase() }} heading</component>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium nostrum voluptatem ipsum commodi?
          Quaerat, eaque iste quo vitae incidunt quis odit culpa ea maiores porro praesentium totam in fuga? Facere?
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium nostrum voluptatem ipsum commodi?
          Quaerat, eaque iste quo vitae incidunt quis odit culpa ea maiores porro praesentium totam in fuga? Facere?
        </p>
      </template>
    </div>
  </template>
</template>
