<template>
  <div>
    <component
      :is="currentComponent"
      v-on="$listeners"
      v-bind="$attrs"
      :title="itemTitle"
    />
  </div>
</template>

<script lang="ts">
import useTranslate from "@/compositions/useTranslate";
import { CourseEditorTypes } from "@/types/constants";
import { computed, defineComponent, toRef, toRefs } from "@vue/composition-api";
import CourseEditorCheckbox from "./EditorTypes/CourseEditorCheckbox.vue";
import CourseEditorChecklist from "./EditorTypes/CourseEditorChecklist.vue";
import CourseEditorCrosscheck from "./EditorTypes/CourseEditorCrosscheck.vue";
import CourseEditorInfo from "./EditorTypes/CourseEditorInfo.vue";
import CourseEditorQuestion from "./EditorTypes/CourseEditorQuestion.vue";
import CourseEditorTest from "./EditorTypes/CourseEditorTest/CourseEditorTest.vue";

export default defineComponent({
  components: { CourseEditorInfo, CourseEditorChecklist, CourseEditorQuestion },
  props: {
    type: String,
    idx: Number
  },
  setup(props) {
    const { type, idx } = toRefs(props);
    const components = {
      [CourseEditorTypes.info]: CourseEditorInfo,
      [CourseEditorTypes.question]: CourseEditorQuestion,
      [CourseEditorTypes.checklist]: CourseEditorChecklist,
      [CourseEditorTypes.checkbox]: CourseEditorCheckbox,
      [CourseEditorTypes.test]: CourseEditorTest,
      [CourseEditorTypes.crosscheck]: CourseEditorCrosscheck,
    };
    const currentComponent = computed(() => {
      return components[type.value];
    });
    const itemTitle = computed(() => {
      return `${useTranslate().i18n.t("editorTypes." + type.value)} ${idx.value}`;
    });
    return { CourseEditorTypes, currentComponent, itemTitle };
  },
});
</script>

<style lang="scss">
</style>