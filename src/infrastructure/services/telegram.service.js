import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const sendTelegramNotification = async (orderDetails) => {
  const message = `
    🎉 *NUEVO PEDIDO RECIBIDO* 🎉

    *ID de Pedido:* ${orderDetails.id}
    *Total:* Bs.${orderDetails.total.toFixed(2)}

    *Productos:*
    ${orderDetails.products.map(p => `- ${p.quantity}x ${p.product.name} color ${p.product.color} - Bs.${p.product.price.toFixed(2)} c/u`).join('\n')}

    *Cliente:* ${orderDetails.user.name}
    *Celular:* ${orderDetails.user.celular}

  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('Notificación de pedido enviada a Telegram.');
  } catch (error) {
    console.error('Error al enviar la notificación a Telegram:', error.response.data);
  }
};