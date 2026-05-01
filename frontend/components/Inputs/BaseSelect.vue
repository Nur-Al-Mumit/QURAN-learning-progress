<template>
  <section>
    <div class="flex">
      <label :for="label" class="pl-1 mb-[2px] font-semibold text-left">
        <span>{{ label }}</span>
      </label>
      <p class="text-red-600" v-if="required">*</p>
    </div>
    <div class="relative group">
      <select
        id=""
        name=""
        :required="required"
        :disabled="disable"
        v-model="selectedOptionStore"
        @change="handleSelectedOption(selectedOptionStore, $event)"
        :class="[
          selectClass,
          'appearance-none w-full px-5 py-[10px] border rounded-sm outline-hidden focus:border-blue-500 base-tran',
          disable ? 'opacity-50 cursor-not-allowed bg-gray-200 border-gray-300 text-gray-500' : 'bg-transparent cursor-pointer',
        ]"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <!-- <option value="" selected>{{selectedOptionStore.title}}</option> -->
        <option
          v-for="(option, index) in options"
          :key="index"
          :value="option.id"
          :id="option.id"
        >
          {{ option.title }}
        </option>
      </select>
      <svg
        class="pointer-events-none group-active:rotate-180 absolute top-0 right-3 h-full w-6 text-gray-400 base-trans"
        viewBox="0 0 20 20"
        fill="black"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </section>
</template>

<script setup>
  const props = defineProps({
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Select an Option",
    },
    disable: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Array,
      required: true,
    },
    selectClass: {
      type: String,
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
  });

  const emit = defineEmits(["update:modelValue", "selectedOption"]);

  const selectedOptionStore = ref("");

  function handleSelectedOption(selectedOption) {
    emit("selectedOption", selectedOption);
    emit("update:modelValue", selectedOption);
    // console.log(selectedOption);
  }

  // console.log(props.modelValue, "");
  // console.log(props.options);

  // watch(
  //   () => props.modelValue,
  //   () => {
  //     selectedOptionStore.value = props.options.filter(
  //       (option) => option.id == props.modelValue
  //     );

  //     // selectedOptionStore.value = selectedOptionF;
  //     // console.log(selectedOptionStore.value);
  //     // console.log(props.modelValue);
  //     // console.log(selectedOptionStore.value);
  //   },
  //   { immediate: true }
  // );
</script>
