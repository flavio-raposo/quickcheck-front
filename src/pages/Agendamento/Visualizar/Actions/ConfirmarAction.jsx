import UpdateAction, { UpdateActionCommonType } from './UpdateAction';
import { AgendamentoStatus } from '../../../../config/enums';
import { updateHorarioStatus } from '../../../../store/modules/horarios/reducer';

ConfirmarAction.propTypes = UpdateActionCommonType;

export default function ConfirmarAction({ horario, setHorario, status }) {
  return (
    <UpdateAction
      horario={horario}
      setHorario={setHorario}
      title="Confirmar a consulta?"
      onUpdate={updateHorarioStatus({
        horario: { ...horario, status: AgendamentoStatus.AGENDADO }
      })}
      confirmColor="secondary"
      buttonLabel="Confirmar"
      confirmLabel="Confirmar"
      readOnlyText="Você deseja confirmar a consulta?"
      disabled={status !== AgendamentoStatus.PENDENTE}
      keyName="status"
    />
  );
}
