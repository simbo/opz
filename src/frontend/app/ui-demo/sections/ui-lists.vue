<script setup lang="ts">
const sizes = ['xs', 's', 'm', 'l', 'xl'];
</script>

<template>
  <h3>Unordered Lists</h3>

  <template v-for="size in sizes" :key="size">
    <h4>
      <code>.gap--{{ size }}</code> {{ size === 'm' ? ' (default)' : '' }}
    </h4>
    <ul :class="`gap--${size}`">
      <li>Simple list item</li>
      <li>
        Longer list item with a lot of text to test line wrapping and indentation — Lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
      </li>
      <li>
        Nested list
        <ul>
          <li>Sub-item A</li>
          <li>
            Sub-item B
            <ul>
              <li>Third level</li>
              <li>Another sub-item with more text</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>Last item</li>
    </ul>
  </template>

  <h3>Ordered Lists</h3>

  <template v-for="size in sizes" :key="size">
    <h4>
      <code>.gap--{{ size }}</code> {{ size === 'm' ? ' (default)' : '' }}
    </h4>
    <ol :class="`gap--${size}`">
      <li>Step 1</li>
      <li>
        Step 2 — Longer list item with a lot of text to test line wrapping and indentation — Lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
      </li>
      <li>
        Step 3 with sub-steps
        <ol>
          <li>Sub-step i</li>
          <li>
            Sub-step ii
            <ol>
              <li>Level three — Third level</li>
              <li>Level three — Another sub-item with more text</li>
            </ol>
          </li>
        </ol>
      </li>
      <li>Step 4</li>
    </ol>
  </template>

  <h3>Mixed Lists</h3>

  <template v-for="size in sizes" :key="size">
    <h4>
      <code>.gap--{{ size }}</code> {{ size === 'm' ? ' (default)' : '' }}
    </h4>
    <ul :class="`gap--${size}`">
      <li>
        Mixed content
        <ol>
          <li>Numbered sub-list</li>
          <li>Another numbered item</li>
        </ol>
      </li>
      <li>
        Another item
        <dl>
          <dt>Term A</dt>
          <dd>Definition for A</dd>
          <dt>Term B</dt>
          <dd>Longer definition for B that may span multiple lines for testing purposes.</dd>
        </dl>
      </li>
    </ul>
  </template>

  <h3>Description Lists</h3>

  <template v-for="size in sizes" :key="size">
    <h4>
      <code>.gap--{{ size }}</code> {{ size === 'm' ? ' (default)' : '' }}
    </h4>
    <dl :class="`gap--${size}`">
      <dt>Short term</dt>
      <dd>Short definition.</dd>

      <dt>Longer term that spans multiple words</dt>
      <dd>Definition that spans several lines to see how wrapping and spacing behave.</dd>

      <dt>Multiple definitions</dt>
      <dd>First explanation</dd>
      <dd>Second explanation</dd>
      <dd>Third explanation with a lot of text to check wrapping and spacing behavior in longer cases.</dd>

      <dt>Nested content</dt>
      <dd>
        <ul>
          <li>One item</li>
          <li>Another item</li>
        </ul>
      </dd>
    </dl>
  </template>

  <h4><code>.dl--aligned</code></h4>

  <dl class="dl--aligned">
    <dt>Version</dt>
    <dd>1.2.3</dd>
    <dt>Repository</dt>
    <dd>github.com/simbo/opz</dd>
    <dt>License</dt>
    <dd>MIT License © 2025</dd>
    <dt>Author</dt>
    <dd>Simon Lepel</dd>
  </dl>
</template>
