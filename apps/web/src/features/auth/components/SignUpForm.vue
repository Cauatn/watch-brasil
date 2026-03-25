<script setup lang="ts">
import { isAxiosError } from "axios";
import type { SubmissionHandler } from "vee-validate";
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
  signupValidationSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/signup.schema";
import { authService } from "@/features/auth/services/auth.service";

const router = useRouter();

const onSubmit = (async (values) => {
  const { name, email, password } = values as SignupFormValues;
  try {
    await authService.register({ name, email, password });
    toast.success("Conta criada com sucesso");
    await router.push("/signin");
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 409) {
      toast.error("E-mail já cadastrado");
      return;
    }
    toast.error("Não foi possível criar conta");
  }
}) as SubmissionHandler;
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Criar conta</CardTitle>
      <CardDescription>
        Informe seus dados abaixo para criar sua conta
      </CardDescription>
    </CardHeader>

    <CardContent>
      <Form
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
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input
                type="text"
                autocomplete="name"
                placeholder="John Doe"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>E-mail</FormLabel>
            <FormControl>
              <Input
                type="email"
                autocomplete="email"
                placeholder="voce@exemplo.com"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <Input
                type="password"
                autocomplete="new-password"
                placeholder="Sua senha"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPassword">
          <FormItem>
            <FormLabel>Confirmar senha</FormLabel>
            <FormControl>
              <Input
                type="password"
                autocomplete="new-password"
                placeholder="Repita sua senha"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-2">
          <Button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Criando…" : "Criar conta" }}
          </Button>

          <p class="text-center text-sm text-muted-foreground">
            Já tem conta?
            <RouterLink
              class="underline underline-offset-4 hover:text-foreground"
              to="/signin"
            >
              Entrar
            </RouterLink>
          </p>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>
