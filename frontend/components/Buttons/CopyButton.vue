<template>
  <div class="group hover:cursor-pointer group">
    <button
    v-if="valueToCopy"
      @click="copyToClipboard"
      :class="['flex gap-x-2 items-center']"
    >
      <p>{{ valueToCopy ?? "" }}</p>
      <span
        :class="[
          'opacity-0 group-hover:opacity-100 base-trans text-white font-semibold rounded-sm focus:outline-hidden ',
          iconClass,
          copied ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600',
        ]"
      >
        <div v-if="copied" v-html="getIcons('copy-thick')"></div>
        <div v-else v-html="getIcons('copy-btn')"></div>
      </span>
    </button>
  </div>
</template>

<script setup>
  import getIcons from "~/components/Buttons/btnIcons";

  // Props to accept the text to copy
  const props = defineProps({
    valueToCopy: {
      required: true,
    },
    iconClass: {
      type: [String],
      default: "",
    },
  });

  const copied = ref(false);

  // Method to handle copying to the clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.valueToCopy);
      copied.value = true;

      // Reset after 2 seconds
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
</script>

<style scoped>
  button {
    transition: background-color 0.3s ease;
  }

  button i {
    transition: transform 0.2s ease;
  }

  button:hover i {
    transform: scale(1.1); /* Slight scaling effect on hover */
  }
</style>
