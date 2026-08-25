import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente do Supabase com as credenciais do seu projeto
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { lat, lon, precisao } = req.body;
            
            // Pega o IP do cliente através do cabeçalho da Vercel
            const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Desconhecido';

            // Insere os dados na tabela 'localizacoes' do Supabase
            const { data, error } = await supabase
                .from('localizacoes')
                .insert([
                    { 
                        ip: ipCliente, 
                        lat: String(lat), 
                        lon: String(lon), 
                        precisao: String(precisao) 
                    }
                ]);

            if (error) {
                console.error("Erro ao inserir no Supabase:", error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ status: 'Sucesso', data });
        } catch (err) {
            console.error("Erro interno:", err);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    } else {
        return res.status(405).json({ error: 'Método não permitido' });
    }
}