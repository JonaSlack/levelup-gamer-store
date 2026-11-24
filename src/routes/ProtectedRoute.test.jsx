import {describe,it,expect,beforeEach} from 'vitest';
import {render,screen} from '@testing-library/react';
import {MemoryRouter,Route,Routes} from 'react-router-dom';
import {TiendaProvider} from '../context/TiendaContext';
import ProtectedRoute from './ProtectedRoute';
import {mockBackend,guardarSesionDePrueba} from '../test/mockApi';
function montar(ruta='/checkout'){return render(<MemoryRouter initialEntries={[ruta]}><TiendaProvider><Routes><Route path="/checkout" element={<ProtectedRoute><h1>Checkout protegido</h1></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><h1>Panel admin</h1></ProtectedRoute>}/><Route path="/login" element={<h1>Debes ingresar</h1>}/><Route path="/acceso-denegado" element={<h1>Acceso denegado</h1>}/></Routes></TiendaProvider></MemoryRouter>);}
beforeEach(()=>{mockBackend();});
describe('ProtectedRoute: sesión y roles',()=>{
  it('PF-32: bloquea una ruta sin sesión',()=>{montar();expect(screen.getByRole('heading',{name:'Debes ingresar'})).toBeInTheDocument();});
  it('PF-33: deja pasar con sesión válida',async()=>{guardarSesionDePrueba('goku');montar();expect(await screen.findByRole('heading',{name:'Checkout protegido'})).toBeInTheDocument();});
  it('PF-34: un CLIENTE no entra al panel admin',async()=>{guardarSesionDePrueba('goku');montar('/admin');expect(await screen.findByRole('heading',{name:'Acceso denegado'})).toBeInTheDocument();});
  it('PF-35: un ADMIN entra al panel admin',async()=>{guardarSesionDePrueba('admin');montar('/admin');expect(await screen.findByRole('heading',{name:'Panel admin'})).toBeInTheDocument();});
  it('PF-36: un token inválido cierra la sesión al recargar',async()=>{sessionStorage.setItem('levelup_sesion',JSON.stringify({accessToken:'token-x',refreshToken:'refresh-x',usuario:{username:'x',rol:'CLIENTE'}}));montar();expect(await screen.findByRole('heading',{name:'Debes ingresar'})).toBeInTheDocument();expect(sessionStorage.getItem('levelup_sesion')).toBeNull();});
});
