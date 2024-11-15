import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMap } from 'react-leaflet';
import dayjs from 'dayjs';

import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import { getEstabelecimentosByStatusAndEspecialidadeAndHorario } from '../../../store/modules/estabelecimentos/reducer';
import colors from '../../../config/colors';
import { VerticalContainer, HorizontalContainer } from '../../../config/GlobalStyle';
import Input, { InputType } from '../../Input/Input';
import InputHora from '../../Input/InputHora';
import { AgendamentoStatus, especialidadesOptions, zoomLevel } from '../../../config/enums';
import { formatCalendarDate } from '../../../hooks/formatDate';
import PropTypes from 'prop-types';

const buttonWidth = '20rem';
const inputWidth = '20rem';

MapSearch.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

function MapSearch({ open, setOpen }) {
  const estabelecimentos = useSelector((state) => state?.estabelecimentos?.estabelecimentos) ?? [];

  const latitude = estabelecimentos[0]?.latitude;
  const longitude = estabelecimentos[0]?.longitude;

  const hasResult = useSelector((state) => state?.estabelecimentos?.hasResult) ?? false;

  const dispatch = useDispatch();

  const map = useMap();

  const initialData = useMemo(() => {
    return {
      status: AgendamentoStatus.DISPONÍVEL,
      nomeFuncionario: '',
      nomeEstabelecimento: '',
      horarioHora: dayjs(),
      horarioAtendimento: formatCalendarDate(new Date().toISOString()), // Convertendo para o formato yyyy-MM-dd
      especialidade: especialidadesOptions[0].value
    };
  }, []);

  const [data, setData] = useState(initialData);

  const handleSearch = () => {
    // Horário que será salvo no banco de dados
    const hora = dayjs(data.horarioHora).format('HH:mm:ss');
    dispatch(
      getEstabelecimentosByStatusAndEspecialidadeAndHorario({
        ...data,
        horarioAtendimento: `${data.horarioAtendimento}T${hora}` // Pesquisando horários a partir dessa data
      })
    );
  };

  useEffect(() => {
    // Navega até o primeiro resultado disponível (em destaque)
    if (hasResult) {
      // TODO: Navegar até o primeiro estabelecimento pagante (propaganda?)
      map.flyTo([latitude, longitude], zoomLevel);
      // Redefinindo o estado de pesquisa
      setOpen(false);
      setData(initialData);
    }
  }, [hasResult, initialData, latitude, longitude, map, setOpen]);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      anchor="bottom"
      PaperProps={{
        sx: {
          backgroundColor: colors.primaryColor
        }
      }}
    >
      <VerticalContainer style={{ padding: '2rem' }}>
        <Input
          data={data}
          setData={setData}
          placeholder="Hospital ou Clínica"
          keyName="nomeEstabelecimento"
          inputWidth={inputWidth}
        />
        <Input
          data={data}
          setData={setData}
          placeholder="Médico"
          keyName="nomeFuncionario"
          inputWidth={inputWidth}
        />
        <Input
          data={data}
          setData={setData}
          placeholder="Especialidade"
          keyName="especialidade"
          inputWidth={inputWidth}
          select
          selectList={especialidadesOptions}
        />
        <HorizontalContainer style={{ width: inputWidth, flexWrap: 'nowrap' }}>
          <Input
            data={data}
            setData={setData}
            placeholder="Data"
            keyName="horarioAtendimento"
            inputType={InputType.DATE}
          />
          <InputHora
            data={data}
            setData={setData}
            hora={dayjs(data.horarioHora)}
            keyName='horarioHora'
          />
        </HorizontalContainer>
        <Button
          variant="contained"
          sx={{ width: buttonWidth, padding: '1rem' }}
          onClick={handleSearch}
        >
          Pesquisar
        </Button>
      </VerticalContainer>
    </Drawer>
  );
}

export default MapSearch;
