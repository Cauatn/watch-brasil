<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { isAxiosError } from "axios"
import type { SubmissionHandler } from "vee-validate"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  loginValidationSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth.store"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const router = useRouter()
const authStore = useAuthStore()

const onSubmit = (async (values) => {
  const { email, password } = values as LoginFormValues
  try {
    await authStore.login({ email, password })
    toast.success("Login realizado")
    await router.push("/")
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 401) {
      toast.error("E-mail ou senha inválidos")
      return
    }
    toast.error("Não foi possível entrar")
  }
}) as SubmissionHandler
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Use seu e-mail e senha para acessar a conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          v-slot="{ isSubmitting }"
          :validation-schema="loginValidationSchema"
          :on-submit="onSubmit"
          as="form"
          class="space-y-4"
        >
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
                  autocomplete="current-password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex flex-col gap-2">
            <Button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? "Entrando…" : "Entrar" }}
            </Button>
            <p class="text-center text-sm text-muted-foreground">
              Não tem conta?
              <RouterLink
                class="underline underline-offset-4 hover:text-foreground"
                to="/signup"
              >
                Criar conta
              </RouterLink>
            </p>
          </div>
        </Form>
      </CardContent>
    </Card>
  </div>
</template>
