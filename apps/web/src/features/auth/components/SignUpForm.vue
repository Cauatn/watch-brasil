<script setup lang="ts">
import { isAxiosError } from "axios";
import type { SubmissionHandler } from "vee-validate";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
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
  buildSignupValidationSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/signup.schema";
import { register } from "@/features/auth/services/auth";

const { t, locale } = useI18n();
const router = useRouter();

const signupValidationSchema = computed(() => buildSignupValidationSchema(t));

const onSubmit = (async (values) => {
  const { name, email, password } = values as SignupFormValues;
  try {
    await register({ name, email, password }).then(() =>
      toast.success(t("auth.signup.toastSuccess")),
    );

    await router.push("/signin");
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 409) {
      toast.error(t("auth.signup.toastConflict"));
      return;
    }

    toast.error(t("auth.signup.toastGeneric"));
  }
}) as SubmissionHandler;
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t("auth.signup.title") }}</CardTitle>
      <CardDescription>
        {{ t("auth.signup.description") }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <Form
        :key="locale"
        v-slot="{ isSubmitting }"
        :validation-schema="signupValidationSchema"
        :initial-values="{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }"
        :on-submit="onSubmit"
        as="form"
        class="space-y-4"
      >
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t("auth.signup.name") }}</FormLabel>
            <FormControl>
              <Input
                type="text"
                autocomplete="name"
                :placeholder="t('auth.signup.namePlaceholder')"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>{{ t("auth.signup.email") }}</FormLabel>
            <FormControl>
              <Input
                type="email"
                autocomplete="email"
                :placeholder="t('auth.signup.emailPlaceholder')"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>{{ t("auth.signup.password") }}</FormLabel>
            <FormControl>
              <Input
                type="password"
                autocomplete="new-password"
                :placeholder="t('auth.signup.passwordPlaceholder')"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>{{ t("auth.signup.confirmPassword") }}</FormLabel>
            <FormControl>
              <Input
                type="password"
                autocomplete="new-password"
                :placeholder="t('auth.signup.confirmPasswordPlaceholder')"
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
                ? t("auth.signup.submitting")
                : t("auth.signup.submit")
            }}
          </Button>

          <p class="text-center text-sm text-muted-foreground">
            {{ t("auth.signup.hasAccount") }}
            <RouterLink
              class="underline underline-offset-4 hover:text-foreground"
              to="/signin"
            >
              {{ t("auth.signup.signIn") }}
            </RouterLink>
          </p>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>
