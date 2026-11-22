
import { useState, useEffect } from 'react';
import ExcluirRecado from './excluirRecado.jsx';
import EditarRecado from './editarRecado.jsx';
import { HoraAtual } from '../services/apiTempo.jsx';
import api from '../services/api.jsx';

function RecadoItem({ recado, onExcluir, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [horaServidor, setHoraServidor] = useState(null);
  const [anexo, setAnexo] = useState(null);

  useEffect(() => {
    HoraAtual().then(setHoraServidor);
  }, []);

  useEffect(() => {
    if (!recado.anexo) {
      setAnexo(null);
      return;
    }

    let url;
    let ativo = true;

    setAnexo(null);

    api.get(`/recados/${recado.id}/anexo`, {
      responseType: 'blob'
    })
      .then((resposta) => {
        url = URL.createObjectURL(resposta.data);

        if (ativo) {
          setAnexo({
            url: url,
            tipo: resposta.data.type
          });
        } else {
          URL.revokeObjectURL(url);
        }
      })
      .catch((erro) => {
        console.error('Erro ao carregar anexo:', erro);
      });

    return () => {
      ativo = false;

      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [recado.id, recado.anexo]);

  // Usa o nome original do arquivo
  const nomeArquivo = recado.nome_anexo ||
    (recado.anexo ? recado.anexo.split('/').pop() : null);

  const extensao = nomeArquivo
    ? nomeArquivo.split('.').pop().toLowerCase()
    : '';

  return (
    <li className="recado-item">
      {!editando && (
        <div>
          <h3>{recado.titulo}</h3>

          <p>{recado.texto}</p>

          <p>
            <strong>Anexo:</strong>{' '}
            {nomeArquivo || 'Nenhum anexo'}
          </p>

          {anexo && (
            <div className="recado-anexo">
              {['jpg', 'jpeg', 'png'].includes(extensao) ? (
                <img
                  src={anexo.url}
                  alt="Imagem anexada ao recado"
                  className="recado-imagem"
                />
              ) : extensao === 'pdf' ? (
                <div>
                  <iframe
                    src={anexo.url}
                    title="PDF anexado ao recado"
                    width="100%"
                    height="500"
                  />

                  <a href={anexo.url} download={nomeArquivo}>
                    Baixar PDF
                  </a>
                </div>
              ) : (
                <a href={anexo.url} download={nomeArquivo}>
                  Baixar anexo
                </a>
              )}
            </div>
          )}

          {recado.anexo && !anexo && (
            <p>Carregando anexo...</p>
          )}

          {horaServidor && (
            <small className="recado-hora">
              consultado em: {horaServidor.toLocaleString('pt-BR')}
            </small>
          )}
        </div>
      )}

      <EditarRecado
        recado={recado}
        onEditar={onEditar}
        editando={editando}
        setEditando={setEditando}
      />

      {!editando && (
        <div className="recado-acoes">
          <ExcluirRecado id={recado.id} onExcluir={onExcluir} />
        </div>
      )}
    </li>
  );
}

export default RecadoItem;
