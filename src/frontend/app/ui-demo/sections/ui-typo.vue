<script setup lang="ts">
const headlines = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
</script>

<template>
  <p>
    This is a medium paragraph. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat error impedit voluptas
    vitae tenetur sint animi soluta doloremque illum praesentium distinctio, explicabo eaque cumque deleniti, numquam,
    beatae atque consequatur labore.
  </p>

  <h3>Inline Elements</h3>

  <p>
    Lorem ipsum <code>code</code> dolor, sit <em>amet consectetur</em> adipisicing elit.
    <strong>Molestias repudiandae</strong> nulla, jure <samp>samp</samp> nisi, odio
    <strong><em>eum quo reprehenderit</em></strong> architecto ipsa deleniti incidunt? Aut deleniti soluta
    <kbd>⌘</kbd>+<kbd>Q</kbd> adipisci quis totam ex! <a href="#">Eveniet, ipsam?</a>
  </p>

  <h3><code>.large--block</code> or <code>p.large</code></h3>

  <p class="large">
    This is a <code>.large</code> paragraph. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat error
    impedit voluptas vitae tenetur sint animi soluta doloremque illum praesentium distinctio, explicabo eaque cumque
    deleniti, numquam, beatae atque consequatur labore.
  </p>

  <h3><code>.small--block</code> or <code>p.small</code></h3>

  <p class="small">
    This is a <code>.small</code> paragraph. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat error
    impedit voluptas vitae tenetur sint animi soluta doloremque illum praesentium distinctio, explicabo eaque cumque
    deleniti, numquam, beatae atque consequatur labore.
  </p>

  <template v-for="headline in headlines" :key="headline">
    <component :is="headline">Headline {{ headline.toUpperCase() }}</component>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti sapiente esse perspiciatis ducimus, dicta
      ratione saepe itaque perferendis. Sunt impedit, saepe numquam fuga ex dolores libero mollitia nisi a autem.
    </p>
  </template>
</template>
