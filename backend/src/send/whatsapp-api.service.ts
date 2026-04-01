import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappApiService {
  async sendTextMessage(recipient: string, message: string): Promise<any> {
    const numberId = process.env.WHATSAPP_NUMBER_ID;
    const token = process.env.WHATSAPP_TOKEN;
    const url = `https://graph.facebook.com/v19.0/${numberId}/messages`;
    const data = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: message },
    };
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return { error: error.response?.data || error.message };
    }
  }
}
