<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Historial de Envíos</h2>

    <VCard>
      <VCardText>
        <VTextField v-model="search" prepend-inner-icon="mdi-magnify" label="Buscar..." density="compact" class="mb-4" style="max-width: 300px" />
        <VTable>
          <thead>
            <tr>
              <th>Destinatario</th>
              <th>Mensaje</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Campaña</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="text-center text-medium-emphasis py-6">Sin registros</td>
            </tr>
            <tr v-for="h in filtered" :key="h.id">
              <td>{{ h.recipient }}</td>
              <td>{{ truncate(h.message, 50) }}</td>
              <td><VChip size="x-small" label>{{ h.type }}</VChip></td>
              <td>
                <VChip :color="h.status === 'success' ? 'success' : 'error'" size="x-small" label>
                  {{ h.status }}
                </VChip>
              </td>
              <td>{{ h.campaignId ? `#${h.campaignId}` : '—' }}</td>
              <td class="text-caption">{{ formatDate(h.createdAt) }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { history } from '../api'

const historyList = ref([])
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return historyList.value
  const q = search.value.toLowerCase()
  return historyList.value.filter(h =>
    h.recipient?.toLowerCase().includes(q) || h.message?.toLowerCase().includes(q)
  )
})

const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str
const formatDate = d => d ? new Date(d).toLocaleString('es-CO') : '—'

onMounted(async () => {
  const res = await history.getAll()
  historyList.value = res.data
})
</script>
