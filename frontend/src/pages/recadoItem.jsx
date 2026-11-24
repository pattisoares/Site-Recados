
import { useState, useEffect } from 'react';
import ExcluirRecado from './excluirRecado.jsx';
import EditarRecado from './editarRecado.jsx';
import { HoraAtual } from '../services/apiTempo.jsx';
import api from '../services/api.jsx';

function RecadoItem({ recado, onExcluir, onEditar, mensagemSucesso }) {
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
            url,
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

  const nomeArquivo = recado.nome_anexo ||
    (recado.anexo ? recado.anexo.split('/').pop() : null);

  const extensao = nomeArquivo
    ? nomeArquivo.split('.').pop().toLowerCase()
    : '';

  const ehImagem = ['jpg', 'jpeg', 'png'].includes(extensao);

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
              {ehImagem ? (
                <div>
                  <a
                    href={anexo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Clique para ampliar"
                    style={{ display: 'inline-block' }}
                  >
                    <img
                      src={anexo.url}
                      alt="Imagem anexada ao recado"
                      style={{
                        display: 'block',
                        width: '180px',
                        height: '130px',
                        maxWidth: '180px',
                        maxHeight: '130px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                  </a>

                  <p style={{ marginTop: '8px' }}>
                    <a
                      href={anexo.url}
                      download={nomeArquivo}
                    >
                      Baixar imagem
                    </a>
                  </p>
                </div>
              ) : extensao === 'pdf' ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    maxWidth: '350px',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '30px' }}>
                    📄
                  </span>

                  <div>
                    <strong>{nomeArquivo}</strong>

                    <div style={{ marginTop: '8px' }}>
                      <a
                        href={anexo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir PDF
                      </a>

                      {' | '}

                      <a
                        href={anexo.url}
                        download={nomeArquivo}
                      >
                        Baixar PDF
                      </a>
                    </div>
                  </div>
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

      {!editando && mensagemSucesso && (
        <p className="mensagem-sucesso">
          Recado editado com sucesso!
        </p>
      )}

      {!editando && (
        <div className="recado-acoes">
          <ExcluirRecado
            id={recado.id}
            onExcluir={onExcluir}
          />
        </div>
      )}
    </li>
  );
}

export default RecadoItem;
