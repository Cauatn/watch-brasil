<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createVideoValidationSchema,
  type CreateVideoFormValues,
} from "../schemas/create-video.schema"
import type { CreateVideoPayload } from "../types/video"
import { videosService } from "../services/videos.service"

const router = useRouter()
const queryClient = useQueryClient()

const { mutateAsync, isPending } = useMutation({
  mutationFn: (payload: CreateVideoPayload) => videosService.create(payload),
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["videos"] })
    toast.success("Filme adicionado ao catálogo")
    await router.push("/")
  },
})

function toPayload(values: CreateVideoFormValues): CreateVideoPayload {
  const description = values.description?.trim()
  return {
    title: values.title.trim(),
    url: values.url.trim(),
    coverUrl: values.coverUrl.trim(),
    ...(description ? { description } : {}),
  }
}

const onSubmit = (async (values) => {
  try {
    await mutateAsync(toPayload(values as CreateVideoFormValues))
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 400) {
      toast.error("Dados inválidos. Confira as URLs e o título.")
      return
    }
    toast.error("Não foi possível cadastrar o filme")
  }
}) as SubmissionHandler
</script>

<template>
  <Card class="mx-auto max-w-xl border-white/10 bg-[#1a1a1a] text-white shadow-xl">
    <CardHeader>
      <CardTitle class="text-xl text-white">Novo filme</CardTitle>
      <CardDescription class="text-white/60">
        Informe URLs públicas do vídeo e da capa (o servidor não faz upload de
        arquivos).
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form
        v-slot="{ isSubmitting }"
        :validation-schema="createVideoValidationSchema"
        :initial-values="{ title: '', url: '', coverUrl: '', description: '' }"
        :on-submit="onSubmit"
        as="form"
        class="space-y-5"
      >
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel class="text-white/90">Título</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                autocomplete="off"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                placeholder="Ex.: Nome do filme"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="url">
          <FormItem>
            <FormLabel class="text-white/90">URL do vídeo</FormLabel>
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
            <FormLabel class="text-white/90">URL da capa</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="url"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                placeholder="https://… (imagem)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel class="text-white/90">Sinopse (opcional)</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                rows="4"
                class="border-white/15 bg-[#121212] text-white placeholder:text-white/40"
                placeholder="Breve descrição…"
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
            {{ isSubmitting || isPending ? "Salvando…" : "Adicionar ao catálogo" }}
          </Button>
          <Button
            type="button"
            variant="outline"
            class="border-white/20 bg-transparent text-white hover:bg-white/10"
            :disabled="isSubmitting || isPending"
            @click="router.push('/')"
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>
