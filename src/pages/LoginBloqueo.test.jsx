import {describe,it,expect,beforeEach,vi} from 'vitest';
import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter,Routes,Route} from 'react-router-dom';
import {TiendaProvider} from '../context/TiendaContext';
import Login from './Login';
import {respuesta} from '../test/mockApi';

// el backend bloquea la cuenta al tercer intento fallido
function backendConBloqueo(){let fallos=0;vi.stubGlobal('fetch',vi.fn((url)=>{if(!String(url).endsWith('/auth/login'))return respuesta(503,{});fallos++;if(fallos>=3)return respuesta(423,{status:423,mensaje:'Cuenta bloqueada por demasiados intentos fallidos. Intenta de nuevo en 5 minutos'});const quedan=3-fallos;return respuesta(401,{status:401,mensaje:`Usuario o contraseña incorrectos. Te queda${quedan===1?'':'n'} ${quedan} intento${quedan===1?'':'s'}`});}));}
function montar(){render(<MemoryRouter initialEntries={['/login']}><TiendaProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<h1>Página principal</h1>}/></Routes></TiendaProvider></MemoryRouter>);}
async function intentar(user){await user.clear(screen.getByLabelText('Contraseña'));await user.type(screen.getByLabelText('Contraseña'),'mala');await user.click(screen.getByRole('button',{name:'Ingresar'}));}
beforeEach(()=>{backendConBloqueo();});
describe('Login: bloqueo por intentos fallidos',()=>{
  it('PF-41: informa los intentos restantes',async()=>{montar();const user=userEvent.setup();await user.type(screen.getByLabelText('Usuario'),'goku');await intentar(user);expect(await screen.findByText(/Te quedan 2 intentos/)).toBeInTheDocument();});
  it('PF-42: al tercer intento muestra la cuenta bloqueada',async()=>{montar();const user=userEvent.setup();await user.type(screen.getByLabelText('Usuario'),'goku');await intentar(user);await screen.findByText(/Te quedan 2/);await intentar(user);await screen.findByText(/Te queda 1 intento/);await intentar(user);expect(await screen.findByText(/Cuenta bloqueada/)).toBeInTheDocument();expect(sessionStorage.getItem('usuario')).toBeNull();});
});
