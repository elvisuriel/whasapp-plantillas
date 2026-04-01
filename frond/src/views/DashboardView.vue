<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Dashboard</h2>

    <VRow>
      <VCol cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.label">
        <VCard>
          <VCardText class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
            </div>
            <VAvatar :color="stat.color" variant="tonal" size="44" rounded>
              <VIcon :icon="stat.icon" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Campañas recientes -->
    <VRow class="mt-4">
      <VCol cols="12" md="7">
        <VCard>
          <VCardItem>
            <VCardTitle>Campañas Recientes</VCardTitle>
          </VCardItem>
          <VCardText>
            <VTable density="compact">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Enviados</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="campaigns.length === 0">
                  <td colspan="4" class="text-center text-medium-emphasis py-4">Sin campañas aún</td>
                </tr>
                <tr v-for="c in campaigns.slice(0, 5)" :key="c.id">
                  <td>{{ c.name }}</td>
                  <td>
                    <VChip :color="statusColor(c.status)" size="x-small" label>{{ c.status }}</VChip>
                  </td>
                  <td>{{ c.sent }}</td>
                  <td>{{ c.total }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="5">
        <VCard>
          <VCardItem>
            <VCardTitle>Historial Reciente</VCardTitle>
          </VCardItem>
          <VCardText>
            <VList density="compact">
              <div v-if="history.length === 0" class="text-center text-medium-emphasis py-4">Sin envíos aún</div>
              <VListItem
                v-for="h in history.slice(0, 6)"
                :key="h.id"
                :subtitle="h.recipient"
              >
                <template #prepend>
                  <VIcon :color="h.status === 'success' ? 'success' : 'error'" size="18">
                    {{ h.status === 'success' ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </VIcon>
                </template>
                <template #title>
                  <span class="text-sm">{{ truncate(h.message, 35) }}</span>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { campaigns as campaignsApi, history as historyApi, templates, lists } from '../api'

const campaigns = ref([])
const history = ref([])
const templatesCount = ref(0)
const listsCount = ref(0)

const stats = computed(() => [
  { label: 'Plantillas', value: templatesCount.value, icon: 'mdi-file-document-multiple', color: 'primary' },
  { label: 'Listas', value: listsCount.value, icon: 'mdi-account-group', color: 'info' },
  { label: 'Campañas', value: campaigns.value.length, icon: 'mdi-bullhorn', color: 'warning' },
  { label: 'Mensajes Enviados', value: history.value.filter(h => h.status === 'success').length, icon: 'mdi-send-check', color: 'success' },
])

const statusColor = (s) => ({ done: 'success', running: 'warning', pending: 'info', error: 'error' }[s] || 'secondary')
const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str

onMounted(async () => {
  try {
    const [c, h, t, l] = await Promise.all([
      campaignsApi.getAll(), historyApi.getAll(), templates.getAll(), lists.getAll()
    ])
    campaigns.value = c.data
    history.value = h.data
    templatesCount.value = t.data.length
    listsCount.value = l.data.length
  } catch {}
})
</script>
