import { useState } from 'react';
import ExcluirRecado from './excluirRecado.jsx';
import EditarRecado from './editarRecado.jsx';

function RecadoItem({ recado, onExcluir, onEditar }) {
  const [editando, setEditando] = useState(false);

  return (
    <li className="recado-item">
      {!editando && (
        <>
          <h3>{recado.titulo}</h3>
          <p>{recado.descricao}</p>
        </>
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