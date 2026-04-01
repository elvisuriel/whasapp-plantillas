<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Conectar WhatsApp</h2>

    <VRow justify="center">
      <VCol cols="12" md="6">
        <VCard>
          <VCardText class="text-center pa-8">

            <!-- Conectado -->
            <template v-if="status === 'connected'">
              <VIcon color="success" size="80">mdi-check-circle</VIcon>
              <div class="text-h6 mt-4">¡WhatsApp Conectado!</div>
              <div class="text-medium-emphasis mt-2">Ya puede enviar mensajes y lanzar campañas.</div>
            </template>

            <!-- QR disponible -->
            <template v-else-if="qr">
              <div class="text-body-1 mb-4">Escanee el QR con su WhatsApp</div>
              <VImg :src="qr" max-width="260" class="mx-auto rounded-lg" />
              <div class="text-caption text-medium-emphasis mt-4">
                WhatsApp → Dispositivos vinculados → Vincular un dispositivo
              </div>
            </template>

            <!-- Cargando QR -->
            <template v-else>
              <VProgressCircular indeterminate color="success" size="64" />
              <div class="text-body-1 mt-4">Generando QR...</div>
              <div class="text-caption text-medium-emphasis mt-2">Puede tomar unos segundos</div>
            </template>

          </VCardText>

          <VCardActions class="justify-center pb-6">
            <VBtn
              v-if="status !== 'connected'"
              color="success"
              variant="flat"
              :loading="loading"
              @click="fetchQR"
            >
              <VIcon start>mdi-refresh</VIcon>
              Actualizar QR
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { whatsapp } from '../api'

const qr = ref(null)
const status = ref('disconnected')
const loading = ref(false)

const fetchQR = async () => {
  loading.value = true
  try {
    const res = await whatsapp.getQR()
    status.value = res.data.status
    qr.value = res.data.qr || null
  } catch {} finally {
    loading.value = false
  }
}

let interval
onMounted(() => {
  fetchQR()
  interval = setInterval(fetchQR, 8000)
})
onUnmounted(() => clearInterval(interval))
</script>
