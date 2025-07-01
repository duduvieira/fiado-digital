export const generateWhatsAppMessage = (
  clientName: string,
  totalDebt: number,
  storeName?: string
): string => {
  const message = `Olá ${clientName}! 👋

${storeName ? `Aqui é da ${storeName}.` : 'Espero que esteja tudo bem com você!'}

Estou passando para lembrá-lo(a) que você tem um saldo pendente de *R$ ${totalDebt.toFixed(2).replace('.', ',')}* em nossa conta.

Quando puder, dê uma passadinha aqui para acertarmos! 😊

Obrigado pela confiança e preferência! 🙏`;

  return encodeURIComponent(message);
};

export const sendWhatsAppMessage = (phone: string, message: string) => {
  // Remove non-numeric characters from phone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Add Brazil country code if not present
  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};