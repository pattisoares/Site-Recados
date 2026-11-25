
import { useEffect, useState } from 'react';
import api from '../services/api.jsx';

function AdminRecados() {
  const [recados, setRecados] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarRecados() {
      try {
        const resposta = await api.get('/admin/recados');
        setRecados(resposta.data);
      } catch (erro) {
        if (erro.response?.status === 403) {
          setErro('Acesso permitido somente para administradores.');
        } else {
          setErro('Não foi possível carregar os recados.');
        }
      }
    }

    carregarRecados();
  }, []);

  function formatarData(data) {
    if (!data) return 'Não informada';

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(data));
  }

  function foiModificado(recado) {
    if (!recado.created_at || !recado.updated_at) {
      return false;
    }

    return new Date(recado.updated_at).getTime() >
      new Date(recado.created_at).getTime();
  }

  async function baixarAnexo(recado) {
    try {
      const resposta = await api.get(
        `/recados/${recado.id}/anexo`,
        { responseType: 'blob' }
      );

      const arquivo = new Blob([resposta.data]);
      const url = window.URL.createObjectURL(arquivo);

      const link = document.createElement('a');
      link.href = url;
      link.download = recado.nome_anexo || 'anexo';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (erro) {
      setErro('Não foi possível baixar o anexo.');
    }
  }


  return (
    <div className="admin-recados">

      <div className="admin-cabecalho">
        <div>
          <h2>ADMINISTRADOR</h2>
          <p>Gerencie e acompanhe os recados cadastrados na plataforma.</p>
        </div>

        <div className="admin-contador">
          <span>Total de recados</span>
          <strong>{recados.length}</strong>
        </div>
      </div>

      {erro && (
        <p className="admin-erro">{erro}</p>
      )}

      {recados.length === 0 && !erro && (
        <div className="admin-vazio">
          <h3>Nenhum recado encontrado</h3>
          <p>Ainda não existem recados cadastrados na plataforma.</p>
        </div>
      )}

      <div className="admin-lista">
        {recados.map((recado) => (
          <article className="admin-card" key={recado.id}>

            <div className="admin-autor-faixa">
              <span>Publicado por:</span>

              <strong>
                {recado.user?.name || 'Usuário não identificado'}
              </strong>

              <span className="admin-id">
                Recado #{recado.id}
              </span>
            </div>

            <div className="admin-datas">
              <span>
                Criado em: {formatarData(recado.created_at)}
              </span>

              {foiModificado(recado) && (
                <span>
                  Modificado em: {formatarData(recado.updated_at)}
                </span>
              )}
            </div>

            <div className="admin-card-cabecalho">
              <h3>{recado.titulo}</h3>
            </div>

            <p className="admin-texto">
              {recado.texto}
            </p>

            {recado.anexo && (
              <div className="admin-anexo">
                <span>
                  Anexo: {recado.nome_anexo || 'Arquivo anexado'}
                </span>

                <button
                  onClick={() => baixarAnexo(recado)}
                  className="admin-botao-download"
                >
                  Baixar anexo
                </button>
              </div>
            )}

          </article>
        ))}
      </div>

      

    </div>
  );
}

export default AdminRecados;
