import axios from 'axios'

export async function HoraAtual(){
    try{
        const {data} = await axios.get(
            'https://worldtimeapi.org/api/timezone/America/Sao_Paulo'
        );

        return new Date(data.datetime);
    }catch (err){
        console.error("Erro ao conectar com a api WorldTimeAPI:", err);

        return new Date();
    }
}