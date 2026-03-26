<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { isAxiosError } from "axios";
import type { SubmissionHandler } from "vee-validate";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
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
import {
  buildLoginValidationSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loginValidationSchema = computed(() => buildLoginValidationSchema(t));

const redirectAfterLogin = computed(() => {
  const raw = route.query.redirect;

  const path = typeof raw === "string" ? raw : null;

  return path?.startsWith("/") && !path.startsWith("//") ? path : "/";
});

const onSubmit = (async (values) => {
  const { email, password } = values as LoginFormValues;
  try {
    await authStore
      .login({ email, password })
      .then(() => toast.success(t("auth.login.toastSuccess")));
    await router.push(redirectAfterLogin.value);
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      toast.error(t("auth.login.toastInvalid"));
      return;
    }
    toast.error(t("auth.login.toastGeneric"));
  }
}) as SubmissionHandler;
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>{{ t("auth.login.title") }}</CardTitle>
        <CardDescription>
          {{ t("auth.login.description") }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          :key="locale"
          v-slot="{ isSubmitting }"
          :validation-schema="loginValidationSchema"
          :initial-values="{ email: '', password: '' }"
          :on-submit="onSubmit"
          as="form"
          class="space-y-4"
        >
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>{{ t("auth.login.email") }}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autocomplete="email"
                  :placeholder="t('auth.login.emailPlaceholder')"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>{{ t("auth.login.password") }}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autocomplete="current-password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex flex-col gap-2">
            <Button type="submit" :disabled="isSubmitting">
              {{
                isSubmitting
                  ? t("auth.login.submitting")
                  : t("auth.login.submit")
              }}
            </Button>
            <p class="text-center text-sm text-muted-foreground">
              {{ t("auth.login.noAccount") }}
              <RouterLink
                class="underline underline-offset-4 hover:text-foreground"
                to="/signup"
              >
                {{ t("auth.login.createAccount") }}
              </RouterLink>
            </p>
          </div>
        </Form>
      </CardContent>
    </Card>
  </div>
</template>
