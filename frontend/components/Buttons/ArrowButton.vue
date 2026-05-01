<template>
  <section>
    <button
      @click="handleClick"
      :class="[
        'border border-black text-black hover:bg-black hover:text-white px-5 py-2  font-bold cursor-pointer  base-trans  flex gap-1 rounded-sm group',
        customStyle,
        direction === 'left' ? 'flex-row-reverse' : 'flex-row',
      ]"
    >
      <span>{{ text }}</span>
      <span
        v-if="!isLoading"
        v-html="
          getIcons(
            'right-arrow',
            `w-[20px] transition-transform duration-300 ${
              direction === 'left'
                ? 'rotate-180 group-hover:-translate-x-2'
                : 'group-hover:translate-x-2 '
            }`
          )
        "
      ></span>
      <span
        v-if="isLoading"
        v-html="
          getIcons('sppiner', `w-[20px] transition-transform duration-300 `)
        "
      ></span>
    </button>
  </section>
</template>

<script setup>
  import getIcons from "./btnIcons";

  const props = defineProps({
    click: {
      type: Function,
    },
    text: {
      type: String,
      default: "",
    },
    customStyle: {
      type: String,
      default: "",
    },
    direction: {
      type: String,
      default: "right",
    },
    isLoading: {
      type: Boolean,
      // default: false,
    },
  });
  function handleClick(params) {
    props.click();
  }
</script>
