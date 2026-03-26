<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { isAxiosError } from "axios";
import type { SubmissionHandler } from "vee-validate";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildCreateVideoValidationSchema,
  type CreateVideoFormValues,
} from "../schemas/create-video.schema";
import {
  createVideo,
  type CreateVideoPayload,
} from "@/features/catalog/services/video";

const router = useRouter();
const queryClient = useQueryClient();
const { t, locale } = useI18n();

const createVideoValidationSchema = computed(() =>
  buildCreateVideoValidationSchema(t),
);

const { mutateAsync, isPending } = useMutation({
  mutationFn: (payload: CreateVideoPayload) => createVideo(payload),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["videos"] });
    toast.success(t("addVideo.success"));
    await router.push("/");
  },
});

function toPayload(values: CreateVideoFormValues): CreateVideoPayload {
  const description = values.description?.trim();
  return {
    title: values.title.trim(),
    url: values.url.trim(),
    coverUrl: values.coverUrl.trim(),
    ...(description ? { description } : {}),
  };
}

const onSubmit = (async (values) => {
  try {
    await mutateAsync(toPayload(values as CreateVideoFormValues));
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) {
      toast.error(t("addVideo.errorValidation"));
      return;
    }
    toast.error(t("addVideo.errorGeneric"));
  }
}) as SubmissionHandler;
</script>

<template>
  <Card
    class="mx-auto max-w-xl border-white/10 bg-[#1a1a1a] text-white shadow-xl"
  >
    <CardHeader>
      <CardTitle class="text-xl text-white">{{
        t("addVideo.cardTitle")
      }}</CardTitle>
      <CardDescription class="text-white/60">
        {{ t("addVideo.cardDescription") }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form
        :key="locale"
        v-slot="{ isSubmitting }"
        :validation-schema="createVideoValidationSchema"
        :initial-values="{ title: '', url: '', coverUrl: '', description: '' }"
        :on-submit="onSubmit"
        as="form"
        class="space-y-5"
      >
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel class="text-white/90">{{
              t("addVideo.title")
            }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                autocomplete="off"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                :placeholder="t('addVideo.titlePh')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="url">
          <FormItem>
            <FormLabel class="text-white/90">{{
              t("addVideo.videoUrl")
            }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="url"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                placeholder="https://…"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="coverUrl">
          <FormItem>
            <FormLabel class="text-white/90">{{
              t("addVideo.coverUrl")
            }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="url"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                :placeholder="t('addVideo.coverPh')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel class="text-white/90">{{
              t("addVideo.description")
            }}</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                rows="4"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                :placeholder="t('addVideo.descriptionPh')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-wrap gap-3 pt-2">
          <Button
            type="submit"
            class="bg-[#E50914] text-white hover:bg-[#f6121a]"
            :disabled="isSubmitting || isPending"
          >
            {{
              isSubmitting || isPending
                ? t("addVideo.submitting")
                : t("addVideo.submit")
            }}
          </Button>
          <Button
            type="button"
            variant="outline"
            class="border-white/20 bg-transparent text-white hover:bg-white/10"
            :disabled="isSubmitting || isPending"
            @click="router.push('/')"
          >
            {{ t("addVideo.cancel") }}
          </Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>
