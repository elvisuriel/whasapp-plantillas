<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">Plantillas</h2>
      <VBtn color="success" variant="flat" @click="openDialog()">
        <VIcon start>mdi-plus</VIcon> Nueva Plantilla
      </VBtn>
    </div>

    <VRow>
      <VCol cols="12" md="4" v-for="t in templatesList" :key="t.id">
        <VCard>
          <VCardItem>
            <VCardTitle>{{ t.name }}</VCardTitle>
            <VCardSubtitle>
              <VChip size="x-small" :color="typeColor(t.type)" label>{{ t.type }}</VChip>
            </VCardSubtitle>
          </VCardItem>
          <VCardText>
            <p class="text-body-2">{{ truncate(t.content, 100) }}</p>
            <VImg v-if="t.imageUrl" :src="t.imageUrl" height="100" cover class="rounded mt-2" />
          </VCardText>
          <VCardActions>
            <VBtn size="small" variant="text" @click="openDialog(t)">
              <VIcon>mdi-pencil</VIcon>
            </VBtn>
            <VBtn size="small" variant="text" color="error" @click="remove(t.id)">
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol v-if="templatesList.length === 0" cols="12" class="text-center text-medium-emphasis py-12">
        No hay plantillas aún
      </VCol>
    </VRow>

    <!-- Dialog crear/editar -->
    <VDialog v-model="dialog" max-width="560">
      <VCard>
        <VCardTitle class="pa-4">{{ editing ? 'Editar' : 'Nueva' }} Plantilla</VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <VTextField v-model="form.name" label="Nombre" class="mb-3" />
          <VSelect v-model="form.type" :items="['text','image']" label="Tipo" class="mb-3" />
          <VTextarea v-model="form.content" label="Contenido (use {{variable}} para personalizar)" rows="4" class="mb-3" />
          <VTextField v-if="form.type === 'image'" v-model="form.imageUrl" label="URL de imagen" />
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="text" @click="dialog = false">Cancelar</VBtn>
          <VBtn color="success" variant="flat" :loading="saving" @click="save">Guardar</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { templates } from '../api'

const templatesList = ref([])
const dialog = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ name: '', type: 'text', content: '', imageUrl: '' })

const typeColor = t => ({ text: 'primary', image: 'info' }[t] || 'secondary')
const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str

const openDialog = (t = null) => {
  editing.value = t
  form.value = t ? { ...t } : { name: '', type: 'text', content: '', imageUrl: '' }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editing.value) {
      await templates.update(editing.value.id, form.value)
    } else {
      await templates.create(form.value)
    }
    dialog.value = false
    await load()
  } catch {} finally { saving.value = false }
}

const remove = async (id) => {
  if (!confirm('¿Eliminar plantilla?')) return
  await templates.remove(id)
  await load()
}

const load = async () => {
  const res = await templates.getAll()
  templatesList.value = res.data
}

onMounted(load)
</script>
