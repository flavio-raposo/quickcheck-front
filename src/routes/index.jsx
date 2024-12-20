import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';
import Page404 from '../pages/Page404/Page404';
import Perfil from '../pages/Perfil/Perfil';
import VerPerfil from '../pages/Perfil/Pages/VerPerfil';
import EditarPerfil from '../pages/Perfil/Pages/EditarPerfil';
import AlterarSenha from '../pages/Perfil/Pages/AlterarSenha';
import Agendamento from '../pages/Agendamento/Agendamento';
import history from '../services/history';
import Ajuda from '../pages/Ajuda/Ajuda';
import Sobre from '../pages/Sobre/Sobre';
import { RoutesList } from './enums';

export default function RoutesController() {
  const isLoggedIn = useSelector((state) => state?.usuarios?.isLoggedIn) || false;

  // Obtendo a URL anterior que o usuário tentou acessar (caso não esteja autenticado)
  const location = useLocation();

  // Rotas desprotegidas (qualquer usuário pode acessar, mesmo não estando autenticado)
  const allowedRoutes = [RoutesList.Login, RoutesList.Cadastro, RoutesList.Ajuda, RoutesList.Sobre];

  // Protegendo as rotas, caso o usuário não esteja logado
  function handleAuth(children) {
    if (isLoggedIn) {
      history.push(location);
      return children;
    } else if (!allowedRoutes.includes(location.pathname)) {
      history.push(RoutesList.Login);
      return <Login />;
    }
  }

  return (
    <Routes>
      <Route path={RoutesList.Home} element={handleAuth(<Home />)} />
      <Route path={RoutesList.Login} element={<Login />} />
      <Route path={RoutesList.Cadastro} element={<Cadastro />} />
      <Route path={RoutesList.Perfil} element={handleAuth(<Perfil />)} />
      <Route path={RoutesList.VerPerfil} element={handleAuth(<VerPerfil />)} />
      <Route path={RoutesList.EditarPerfil} element={handleAuth(<EditarPerfil />)} />
      <Route path={RoutesList.AlterarSenha} element={handleAuth(<AlterarSenha />)} />
      <Route path={RoutesList.AgendamentosLista} element={handleAuth(<Agendamento />)} />
      <Route path={RoutesList.Ajuda} element={<Ajuda />} />
      <Route path={RoutesList.Sobre} element={<Sobre />} />
      <Route path={RoutesList.NotFound} element={<Page404 />} />
    </Routes>
  );
}
