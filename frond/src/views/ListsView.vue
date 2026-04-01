<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h2 class="text-h5 font-weight-bold">Listas de Contactos</h2>
      <VBtn color="success" variant="flat" @click="openDialog()">
        <VIcon start>mdi-plus</VIcon> Nueva Lista
      </VBtn>
    </div>

    <VRow>
      <VCol cols="12" md="4" v-for="l in listsList" :key="l.id">
        <VCard>
          <VCardItem>
            <VCardTitle>{{ l.name }}</VCardTitle>
            <VCardSubtitle>{{ l.recipients?.length ?? 0 }} contactos</VCardSubtitle>
          </VCardItem>
          <VCardText>
            <VChip
              v-for="(r, i) in (l.recipients || []).slice(0, 3)"
              :key="i"
              size="x-small"
              class="mr-1 mb-1"
            >{{ r }}</VChip>
            <span v-if="(l.recipients?.length ?? 0) > 3" class="text-caption text-medium-emphasis">
              +{{ l.recipients.length - 3 }} más
            </span>
          </VCardText>
          <VCardActions>
            <VBtn size="small" variant="text" @click="openDialog(l)">
              <VIcon>mdi-pencil</VIcon>
            </VBtn>
            <VBtn size="small" variant="text" color="error" @click="remove(l.id)">
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol v-if="listsList.length === 0" cols="12" class="text-center text-medium-emphasis py-12">
        No hay listas aún
      </VCol>
    </VRow>

    <VDialog v-model="dialog" max-width="560">
      <VCard>
        <VCardTitle class="pa-4">{{ editing ? 'Editar' : 'Nueva' }} Lista</VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <VTextField v-model="form.name" label="Nombre de la lista" class="mb-4" />
          <VCombobox
            v-model="form.recipients"
            label="Números (ej: +573001234567)"
            hint="Presione Enter para agregar cada número"
            multiple
            chips
            closable-chips
          />
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
import { lists } from '../api'

const listsList = ref([])
const dialog = ref(false)
const saving = ref(false)
const editing = ref(null)
const form = ref({ name: '', recipients: [] })

const openDialog = (l = null) => {
  editing.value = l
  form.value = l ? { name: l.name, recipients: [...(l.recipients || [])] } : { name: '', recipients: [] }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (editing.value) {
      await lists.update(editing.value.id, form.value)
    } else {
      await lists.create(form.value)
    }
    dialog.value = false
    await load()
  } catch {} finally { saving.value = false }
}

const remove = async (id) => {
  if (!confirm('¿Eliminar lista?')) return
  await lists.remove(id)
  await load()
}

const load = async () => {
  const res = await lists.getAll()
  listsList.value = res.data
}

onMounted(load)
</script>
