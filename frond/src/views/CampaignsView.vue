<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">Campañas</h2>
      <VBtn color="success" variant="flat" @click="openDialog()">
        <VIcon start>mdi-plus</VIcon> Nueva Campaña
      </VBtn>
    </div>

    <VRow>
      <VCol cols="12" v-for="c in campaignsList" :key="c.id">
        <VCard>
          <VCardText class="d-flex align-center gap-4">
            <VAvatar color="success" variant="tonal" rounded size="44">
              <VIcon>mdi-bullhorn</VIcon>
            </VAvatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold">{{ c.name }}</div>
              <div class="text-caption text-medium-emphasis">
                Plantilla #{{ c.templateId }} · Lista #{{ c.listId }}
              </div>
              <VProgressLinear
                v-if="c.status === 'running' || c.status === 'done'"
                :model-value="c.total > 0 ? (c.sent / c.total) * 100 : 0"
                color="success"
                rounded
                height="4"
                class="mt-2"
                style="max-width: 300px"
              />
            </div>
            <div class="text-center">
              <VChip :color="statusColor(c.status)" size="small" label>{{ c.status }}</VChip>
              <div class="text-caption mt-1">{{ c.sent }}/{{ c.total }} enviados</div>
            </div>
            <div class="d-flex gap-2">
              <VBtn
                v-if="c.status === 'pending'"
                color="success"
                variant="flat"
                size="small"
                :loading="launching === c.id"
                @click="launch(c.id)"
              >
                <VIcon start>mdi-play</VIcon> Lanzar
              </VBtn>
              <VBtn
                variant="text"
                color="error"
                size="small"
                @click="remove(c.id)"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol v-if="campaignsList.length === 0" cols="12" class="text-center text-medium-emphasis py-12">
        No hay campañas aún
      </VCol>
    </VRow>

    <VDialog v-model="dialog" max-width="520">
      <VCard>
        <VCardTitle class="pa-4">Nueva Campaña</VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <VTextField v-model="form.name" label="Nombre de la campaña" class="mb-3" />
          <VSelect
            v-model="form.templateId"
            :items="templateOptions"
            item-title="name"
            item-value="id"
            label="Plantilla"
            class="mb-3"
          />
          <VSelect
            v-model="form.listId"
            :items="listOptions"
            item-title="name"
            item-value="id"
            label="Lista de contactos"
            class="mb-3"
          />
          <VCard variant="outlined" class="pa-3" v-if="selectedTemplate">
            <div class="text-caption text-medium-emphasis mb-2">Variables detectadas en la plantilla:</div>
            <VTextField
              v-for="v in detectedVars"
              :key="v"
              v-model="form.variables[v]"
              :label="`{{${v}}}`"
              density="compact"
              class="mb-2"
            />
            <div v-if="detectedVars.length === 0" class="text-caption">Sin variables</div>
          </VCard>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="text" @click="dialog = false">Cancelar</VBtn>
          <VBtn color="success" variant="flat" :loading="saving" @click="save">Crear</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbar" :color="snackColor" timeout="3000">{{ snackMsg }}</VSnackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { campaigns, templates, lists } from '../api'

const campaignsList = ref([])
const templateOptions = ref([])
const listOptions = ref([])
const dialog = ref(false)
const saving = ref(false)
const launching = ref(null)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref('success')
const form = ref({ name: '', templateId: null, listId: null, variables: {} })

const statusColor = s => ({ done: 'success', running: 'warning', pending: 'info', error: 'error' }[s] || 'secondary')

const selectedTemplate = computed(() => templateOptions.value.find(t => t.id === form.value.templateId))

const detectedVars = computed(() => {
  if (!selectedTemplate.value) return []
  const matches = selectedTemplate.value.content.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
})

const openDialog = () => {
  form.value = { name: '', templateId: null, listId: null, variables: {} }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  try {
    await campaigns.create(form.value)
    dialog.value = false
    await load()
    notify('Campaña creada', 'success')
  } catch { notify('Error al crear', 'error') } finally { saving.value = false }
}

const launch = async (id) => {
  launching.value = id
  try {
    await campaigns.launch(id)
    notify('Campaña lanzada', 'success')
    await load()
  } catch { notify('Error al lanzar', 'error') } finally { launching.value = null }
}

const remove = async (id) => {
  if (!confirm('¿Eliminar campaña?')) return
  await campaigns.remove(id)
  await load()
}

const notify = (msg, color) => { snackMsg.value = msg; snackColor.value = color; snackbar.value = true }

const load = async () => {
  const [c, t, l] = await Promise.all([campaigns.getAll(), templates.getAll(), lists.getAll()])
  campaignsList.value = c.data
  templateOptions.value = t.data
  listOptions.value = l.data
}

onMounted(load)
</script>
