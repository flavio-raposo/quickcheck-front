import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Drawer, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import Input from '../../../../components/Input/Input';
import { VerticalContainer } from '../../../../config/GlobalStyle';
import { agendamentoStatusOptions } from '../../../../config/enums';
import { getHorariosByFuncionarioAndStatus } from '../../../../store/modules/horarios/reducer';

const buttonWidth = '12rem';

FuncionarioFilter.propTypes = {
  data: PropTypes.object.isRequired,
  initialData: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired
};

export default function FuncionarioFilter({ data, initialData, setData }) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(getHorariosByFuncionarioAndStatus({ ...data }));
    setOpen(false);
    toast.success('Pesquisa efetuada com sucesso!');
  };

  const handleReset = () => {
    dispatch(getHorariosByFuncionarioAndStatus({ ...initialData }));
    setData({ ...initialData });
    setOpen(false);
    toast.success('Tabela redefinida com sucesso!');
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Pesquisar
        <Search sx={{ marginLeft: '0.5rem', marginBottom: '0.1rem' }} />
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <VerticalContainer style={{ padding: '2rem' }}>
          <Typography variant="h4">Pesquisar</Typography>
          <Input data={data} setData={setData} keyName="nomeCliente" placeholder="Paciente" />
          <Input
            data={data}
            setData={setData}
            keyName="nomeEstabelecimento"
            placeholder="Hospital/Clínica"
          />
          <Input
            data={data}
            setData={setData}
            keyName="status"
            placeholder="Status"
            select
            selectList={agendamentoStatusOptions}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ width: buttonWidth }}
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ width: buttonWidth }}
            onClick={handleReset}
          >
            Redefinir
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ width: buttonWidth }}
            onClick={() => setOpen(false)}
          >
            Voltar
          </Button>
        </VerticalContainer>
      </Drawer>
    </>
  );
}
