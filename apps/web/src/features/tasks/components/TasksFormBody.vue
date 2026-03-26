<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CatalogVideo } from "@/features/catalog/services/video";
import type { TaskCategory } from "@/features/tasks/types/task";
import { useI18n } from "vue-i18n";

const title = defineModel<string>("title", { required: true });
const description = defineModel<string>("description", { required: true });
const category = defineModel<TaskCategory>("category", { required: true });
const videoId = defineModel<string>("videoId", { required: true });

defineProps<{
  videoOptions: CatalogVideo[];
  submitDisabled: boolean;
}>();

const emit = defineEmits<{
  submit: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <Label class="text-white/90">{{ t("tasks.title") }}</Label>
      <Input
        v-model="title"
        class="border-white/15 bg-black/30 text-white"
        :placeholder="t('tasks.titlePh')"
      />
    </div>
    <div class="space-y-2">
      <Label class="text-white/90">{{ t("tasks.description") }}</Label>
      <Textarea
        v-model="description"
        class="min-h-[80px] border-white/15 bg-black/30 text-white"
        :placeholder="t('tasks.descriptionPh')"
      />
    </div>
    <div class="space-y-2">
      <Label class="text-white/90">{{ t("tasks.category") }}</Label>
      <select
        v-model="category"
        class="flex h-10 w-full rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white"
      >
        <option value="watch_movie">
          {{ t("tasks.categoryWatch") }}
        </option>
        <option value="general">
          {{ t("tasks.categoryGeneral") }}
        </option>
      </select>
    </div>
    <div v-if="category === 'watch_movie'" class="space-y-2">
      <Label class="text-white/90">{{ t("tasks.linkVideo") }}</Label>
      <select
        v-model="videoId"
        class="flex h-10 w-full rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white"
      >
        <option value="">{{ t("tasks.pickVideo") }}</option>
        <option
          v-for="v in videoOptions"
          :key="v.id"
          :value="v.id"
        >
          {{ v.title }}
        </option>
      </select>
    </div>
    <Button
      type="button"
      class="w-full bg-[#E50914] text-white hover:bg-[#c40812]"
      :disabled="submitDisabled"
      @click="emit('submit')"
    >
      {{ t("tasks.submit") }}
    </Button>
  </div>
</template>
