<template>
  <VApp>
    <VNavigationDrawer permanent color="surface" width="240">
      <div class="pa-4 d-flex align-center gap-2">
        <VIcon color="success" size="28">mdi-whatsapp</VIcon>
        <span class="text-h6 font-weight-bold">WA Plantillas</span>
      </div>
      <VDivider />
      <div class="pa-3">
        <VChip :color="statusColor" size="small" label class="w-100 justify-center">
          <VIcon start size="12">mdi-circle</VIcon>
          {{ statusText }}
        </VChip>
      </div>
      <VList density="compact" nav>
        <VListItem
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          active-color="success"
        />
      </VList>
    </VNavigationDrawer>

    <VMain>
      <VContainer fluid class="pa-6">
        <RouterView />
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { whatsapp } from './api'

const status = ref('disconnected')

const menuItems = [
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Conectar WhatsApp', to: '/connect', icon: 'mdi-qrcode-scan' },
  { title: 'Envío Rápido', to: '/send', icon: 'mdi-send' },
  { title: 'Plantillas', to: '/templates', icon: 'mdi-file-document-multiple' },
  { title: 'Listas', to: '/lists', icon: 'mdi-account-group' },
  { title: 'Campañas', to: '/campaigns', icon: 'mdi-bullhorn' },
  { title: 'Historial', to: '/history', icon: 'mdi-history' },
]

const statusColor = computed(() => ({ connected: 'success', qr: 'warning', disconnected: 'error' }[status.value]))
const statusText = computed(() => ({ connected: 'Conectado', qr: 'Esperando QR', disconnected: 'Desconectado' }[status.value]))

const checkStatus = async () => {
  try { const res = await whatsapp.getStatus(); status.value = res.data.status } catch {}
}

let interval
onMounted(() => { checkStatus(); interval = setInterval(checkStatus, 10000) })
onUnmounted(() => clearInterval(interval))
</script>
