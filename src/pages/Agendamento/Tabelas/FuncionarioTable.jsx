import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChipStatus from '../../../components/Chip/ChipStatus';
import formatDate from '../../../hooks/formatDate';
import { getHorarios } from '../../../store/modules/horarios/reducer';
import ProntuarioModal from '../Prontuario/ProntuarioModal';

export default function FuncionarioTable() {
  const horarios = useSelector((state) => state?.horarios?.horarios) || [];

  const dispatch = useDispatch();

  // Armazenar os dados do prontuário
  const [prontuario, setProntuario] = useState('');

  // Abrir o modal oculto
  const [openModal, setOpenModal] = useState(false);

  // Expandir a linha oculta
  const [openHiddenRow, setOpenHiddenRow] = useState(false);

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Configurações da tabela
  const columnWidth = 150;
  const labelRowsPerPage = 'Resultados';

  // Obtendo os horários
  // TODO: Obter os horários de acordo com cada funcionário
  useEffect(() => {
    dispatch(getHorarios());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        {/* Cabeçalho */}
        <TableHead>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            {/* Espaço reservado para o ícone de expandir a linha oculta */}
            <TableCell />
            <TableCell sx={{ minWidth: columnWidth }}>Horário</TableCell>
            <TableCell sx={{ minWidth: columnWidth }}>Paciente</TableCell>
            <TableCell sx={{ minWidth: columnWidth }}>Comorbidades</TableCell>
            <TableCell sx={{ minWidth: columnWidth }}>Hospital/Clínica</TableCell>
            <TableCell sx={{ minWidth: columnWidth }}>Telefone</TableCell>
            <TableCell sx={{ minWidth: columnWidth }}>Endereço</TableCell>
            <TableCell sx={{ minWidth: columnWidth }}>Status</TableCell>
          </TableRow>
        </TableHead>
        {/* Resultados */}
        <TableBody>
          {horarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((horario) => (
            <>
              {/* Linha padrão - sempre visível */}
              <TableRow key={horario.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {/* Ícone para expandir a linha oculta */}
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpenHiddenRow(!openHiddenRow)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                {/* Informações relevantes */}
                <TableCell component="th" scope="row">
                  {formatDate(horario?.horarioAtendimento)}
                </TableCell>
                <TableCell>{horario?.cliente?.usuario?.nome}</TableCell>
                {/* Comorbidades é um array */}
                <TableCell>{horario?.cliente?.comorbidades.join(', ')}</TableCell>
                <TableCell>{horario?.estabelecimento?.usuario?.nome}</TableCell>
                <TableCell>{horario.estabelecimento?.usuario?.telefone}</TableCell>
                <TableCell>{horario.estabelecimento?.usuario?.endereco}</TableCell>
                <TableCell>
                  <ChipStatus status={horario?.status} />
                </TableCell>
              </TableRow>
              {/* Linha oculta - expande quando o usuário clica no ícone */}
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box p="2rem">
                      <Button
                        variant="contained"
                        sx={{ marginRight: '0.5rem' }}
                        color="success"
                        onClick={() => {
                          setProntuario(horario?.prontuario);
                          setOpenModal(true);
                        }}
                      >
                        Prontuário
                      </Button>
                      <Button variant="contained" sx={{ marginRight: '0.5rem' }}>
                        Remarcar
                      </Button>
                      <Button variant="contained" color="error">
                        Cancelar
                      </Button>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
        {/* Paginação */}
        <TableFooter>
          <TableRow sx={{ width: '100%' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={horarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': labelRowsPerPage
                  },
                  native: true
                }
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={labelRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
      {/* Prontuário Modal */}
      <ProntuarioModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        prontuario={prontuario}
      />
    </TableContainer>
  );
}
