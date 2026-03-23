import { randomUUID } from 'node:crypto'
import type { CreateTaskInput, TaskItem, UpdateTaskInput } from './task.schemas.js'

const tasks = new Map<string, TaskItem>()

function buildId() {
  return randomUUID()
}

export function listTasks() {
  return Array.from(tasks.values())
}

export function createTask(input: CreateTaskInput) {
  const task: TaskItem = {
    id: buildId(),
    title: input.title,
    done: false,
    createdAt: new Date().toISOString(),
  }

  tasks.set(task.id, task)
  return task
}

export function getTaskById(taskId: string) {
  return tasks.get(taskId) ?? null
}

export function updateTask(taskId: string, input: UpdateTaskInput) {
  const current = tasks.get(taskId)
  if (!current) {
    return null
  }

  const updated: TaskItem = {
    ...current,
    ...input,
  }

  tasks.set(taskId, updated)
  return updated
}

export function deleteTask(taskId: string) {
  return tasks.delete(taskId)
}
