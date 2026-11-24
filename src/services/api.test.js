import {describe,it,expect,beforeEach,vi} from 'vitest';
import {solicitar,leerSesion,ApiError} from './api';
import {respuesta,guardarSesionDePrueba,sesionDe} from '../test/mockApi';
beforeEach(()=>{sessionStorage.clear();});
describe('Servicio API: tokens JWT',()=>{
  it('PF-37: envía el access token en el header Authorization',async()=>{guardarSesionDePrueba('goku');const f=vi.fn(()=>respuesta(200,[]));vi.stubGlobal('fetch',f);await solicitar('/pedidos/mios');expect(f.mock.calls[0][1].headers.Authorization).toBe('Bearer token-goku');});
  it('PF-38: renueva el token con el refresh token cuando recibe 401',async()=>{guardarSesionDePrueba('goku');const nueva={...sesionDe('goku'),accessToken:'token-nuevo',refreshToken:'refresh-nuevo'};
    const f=vi.fn((url,op)=>{if(String(url).endsWith('/auth/refresh'))return respuesta(200,nueva);return op.headers.Authorization==='Bearer token-nuevo'?respuesta(200,[{id:1}]):respuesta(401,{mensaje:'Token expirado'});});
    vi.stubGlobal('fetch',f);const datos=await solicitar('/pedidos/mios');expect(datos).toEqual([{id:1}]);expect(leerSesion().accessToken).toBe('token-nuevo');});
  it('PF-39: si el refresh falla se borra la sesión',async()=>{guardarSesionDePrueba('goku');vi.stubGlobal('fetch',vi.fn(()=>respuesta(401,{mensaje:'expirado'})));
    let error;try{await solicitar('/pedidos/mios');}catch(e){error=e;}expect(error instanceof ApiError).toBe(true);expect(error.status).toBe(401);expect(leerSesion()).toBeNull();});
  it('PF-40: entrega el mensaje de error del backend',async()=>{vi.stubGlobal('fetch',vi.fn(()=>respuesta(422,{mensaje:'Stock insuficiente para Minecraft'})));
    let error;try{await solicitar('/pedidos',{metodo:'POST',cuerpo:{}});}catch(e){error=e;}expect(error.message).toBe('Stock insuficiente para Minecraft');});
});
