import { useState, useEffect } from 'react';
import ExcluirRecado from './excluirRecado.jsx';
import EditarRecado from './editarRecado.jsx';
import { HoraAtual } from '../services/apiTempo.jsx';

function RecadoItem({ recado, onExcluir, onEditar }) {
  const [editando, setEditando] = useState(false);
  const [horaServidor, setHoraServidor] = useState(null);

  useEffect(() => {
    HoraAtual().then(setHoraServidor);
  }, []);

  return (
    <li className="recado-item">
      {!editando && (
        <ul>
          <h3>{recado.titulo}</h3>
          <p>{recado.texto}</p>
          {horaServidor && (
            <small className='recado-hora'>
              {horaServidor.toLocaleString('pt-BR')}
            </small>
          )}
        </ul>
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