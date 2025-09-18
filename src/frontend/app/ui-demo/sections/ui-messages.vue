<script setup lang="ts">
import Icon from '../../generics/icon/icon.vue';
const messages = ['default', 'error', 'warning', 'info', 'success', 'done'];
</script>

<template>
  <h3><code>.message</code></h3>

  <template v-for="message in messages" :key="message">
    <div :class="`message--${message}`">
      <Icon name="alert-fill" /> Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </div>
    <div :class="`message--${message}`">
      <Icon name="alert-fill" /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum eligendi voluptates
      placeat impedit possimus reiciendis odio neque cumque animi amet alias consequatur nostrum, beatae cum repudiandae
      enim ab ipsa non.
    </div>
  </template>

  <h3><code>.message-box</code></h3>

  <template v-for="message in messages" :key="message">
    <div :class="`message-box--${message}`">
      <Icon name="alert-fill" /> Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </div>
    <div :class="`message-box--${message}`">
      <Icon name="alert-fill" /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum eligendi voluptates
      placeat impedit possimus reiciendis odio neque cumque animi amet alias consequatur nostrum, beatae cum repudiandae
      enim ab ipsa non.
    </div>
  </template>

  <h3><code>.message-box</code> with a <code>.content-flow.gap--s</code> child</h3>

  <div class="message-box">
    <Icon name="quote" />
    <div class="content-flow gap--s">
      <p><strong>Custom Message</strong></p>
      <p>This is a custom message with a more compact content flow.</p>
      <p>It uses <code>.content-flow.gap--s</code> to reduce the vertical spacing between elements.</p>
    </div>
  </div>
</template>
