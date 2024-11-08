import UpdateAction, { UpdateActionCommonType } from './UpdateAction';
import { AgendamentoStatus } from '../../../../config/enums';
import { updateHorarioProntuario } from '../../../../store/modules/horarios/reducer';

ProntuarioAction.propTypes = UpdateActionCommonType;

export default function ProntuarioAction({ horario, setHorario, status }) {
  return (
    <UpdateAction
      horario={horario}
      setHorario={setHorario}
      title="Prontuário"
      onUpdate={updateHorarioProntuario({ horario })}
      buttonLabel="Prontuário"
      confirmLabel="Editar"
      readOnly={false}
      disabled={status !== AgendamentoStatus.AGENDADO}
      keyName="prontuario"
    />
  );
}