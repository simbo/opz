<script setup lang="ts">
const sizes = ['s', 'm', 'l'];
</script>

<template>
  <h3>Text Input</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <input type="text" :class="`control--${size}`" placeholder="Enter text..." />
    <input type="text" :class="`control--${size} control--monospace`" placeholder="Enter text..." />
    <input type="text" :class="`control--${size}`" placeholder="Enter text..." required />
    <input type="text" :class="`control--${size}`" placeholder="Enter text..." disabled />
    <input type="text" value="Lorem ipsum dolor sit amet" :class="`control--${size}`" readonly />
  </div>

  <h3>Number Input</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <input type="number" :class="`control--${size}`" placeholder="Enter number..." />
    <input type="number" :class="`control--${size} control--monospace`" placeholder="Enter number..." />
    <input type="number" :class="`control--${size}`" placeholder="Enter number..." required />
    <input type="number" :class="`control--${size}`" placeholder="Enter number..." disabled />
    <input type="number" value="1234567890" :class="`control--${size}`" readonly />
  </div>

  <h3>Password Input</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <input type="password" :class="`control--${size}`" placeholder="Enter password..." />
    <input type="password" :class="`control--${size} control--monospace`" placeholder="Enter password..." />
    <input type="password" :class="`control--${size}`" placeholder="Enter password..." required />
    <input type="password" :class="`control--${size}`" placeholder="Enter password..." disabled />
    <input type="password" value="Lorem ipsum dolor sit amet" :class="`control--${size}`" readonly />
  </div>

  <h3>Textarea</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <textarea rows="4" :class="`control--${size}`" placeholder="Enter multiple lines of text..."></textarea>
    <textarea
      rows="4"
      :class="`control--${size} control--monospace`"
      placeholder="Enter multiple lines of text..."
    ></textarea>
    <textarea rows="4" :class="`control--${size}`" placeholder="Enter multiple lines of text..." required></textarea>
    <textarea rows="4" :class="`control--${size}`" placeholder="Enter multiple lines of text..." disabled></textarea>
    <textarea rows="4" :class="`control--${size}`" readonly>
Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores fugiat reiciendis ad aut esse repellat cum rerum, excepturi sapiente quaerat voluptatem laboriosam quis animi laudantium, reprehenderit necessitatibus libero. Dolore, ducimus.
    </textarea>
  </div>

  <h3>Select</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <select :class="`control--${size}`">
      <option value="" disabled selected>Select an option...</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>

    <select :class="`control--${size}`" required>
      <option value="" disabled selected>Select an option...</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>

    <select :class="`control--${size}`" disabled>
      <option value="" disabled selected>Select an option...</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
  </div>

  <h3>Checkbox</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <input type="checkbox" :class="`control--${size}`" />
    <input type="checkbox" :class="`control--${size}`" required />
    <input type="checkbox" :class="`control--${size}`" checked />
    <input type="checkbox" :class="`control--${size}`" disabled />
    <input type="checkbox" :class="`control--${size}`" checked disabled />
  </div>

  <h3>Radio Button</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <input type="radio" :name="`radio-group-${size}`" :class="`control--${size}`" />
    <input type="radio" :name="`radio-group-${size}`" :class="`control--${size}`" required />
    <input type="radio" :name="`radio-group-${size}`" :class="`control--${size}`" checked />
    <input type="radio" :name="`radio-group-${size}`" :class="`control--${size}`" disabled />
    <input type="radio" :name="`radio-group-${size}`" :class="`control--${size}`" checked disabled />
  </div>

  <h3>Toggle</h3>

  <div class="demo-row" v-for="size in sizes" :key="size">
    <input type="checkbox" :class="`toggle control--${size}`" />
    <input type="checkbox" :class="`toggle control--${size}`" required />
    <input type="checkbox" :class="`toggle control--${size}`" checked />
    <input type="checkbox" :class="`toggle control--${size}`" disabled />
    <input type="checkbox" :class="`toggle control--${size}`" checked disabled />
  </div>
</template>
