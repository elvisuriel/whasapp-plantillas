<template>
  <div>
    <h2 class="text-h5 font-weight-bold mb-6">Envío Rápido</h2>
    <VRow justify="center">
      <VCol cols="12" md="6">
        <VCard>
          <VCardText class="pa-6">
            <VTextField v-model="form.recipient" label="Número destino (ej: +573001234567)" class="mb-3" />
            <VSelect v-model="form.type" :items="['text','image']" label="Tipo" class="mb-3" />
            <VTextarea v-model="form.message" label="Mensaje" rows="4" class="mb-3" />
            <VTextField v-if="form.type === 'image'" v-model="form.imageUrl" label="URL de imagen" class="mb-3" />
          </VCardText>
          <VDivider />
          <VCardActions class="pa-4">
            <VSpacer />
            <VBtn color="success" variant="flat" :loading="sending" @click="sendMsg" size="large">
              <VIcon start>mdi-send</VIcon> Enviar
            </VBtn>
          </VCardActions>
        </VCard>

        <VAlert v-if="result" :type="result.success ? 'success' : 'error'" class="mt-4">
          {{ result.success ? '¡Mensaje enviado!' : result.error }}
        </VAlert>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { send } from '../api'

const form = ref({ recipient: '', type: 'text', message: '', imageUrl: '' })
const sending = ref(false)
const result = ref(null)

const sendMsg = async () => {
  sending.value = true
  result.value = null
  try {
    const res = await send.single(form.value)
    result.value = { success: res.data.status === 'success' }
    if (result.value.success) form.value.message = ''
  } catch { result.value = { success: false, error: 'Error de conexión' } }
  finally { sending.value = false }
}
</script>
