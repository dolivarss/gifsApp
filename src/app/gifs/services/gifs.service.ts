import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { SearchGifsResponse ,Gifs} from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _apiKey   : string ="TzRDk6Jfj1dED3HeRnPX4b4iDSUAJv4R";
  private _servicioUrl   : string ="https://api.giphy.com/v1/gifs";
  private _historial: string[] =[];
  public resultados: Gifs[]=[];

  get historial(){ 
    return [...this._historial];
  }

  constructor(private http : HttpClient){
   
    //this._historial=JSON.parse(localStorage.getItem('historial')!) || [];

    if(localStorage.getItem('historial')){
      this._historial=JSON.parse( localStorage.getItem('historial')! );
    }

    if(sessionStorage.getItem('ultimaBusqueda')){
      this.resultados=  JSON.parse(sessionStorage.getItem('ultimaBusqueda')!);
    }
    
  }

  buscarGifs(query:string){
    query=query.trim().toUpperCase();

    if(!this._historial.includes(query)){
      //Añadir a el historial la nueva busqueda
      this._historial.unshift(query);
      //MOstrar tan solo las 10 ultimas posiciones de nuestro array historial
      this._historial=this._historial.splice(0,10);

      //Guardar en localStorage la nueva busqueda
      localStorage.setItem('historial',JSON.stringify(this._historial))
    }

    //Construimos los parametros para generar la URL de los GIFS
    const params=new HttpParams().set('api_key',this._apiKey)
                                 .set('q',query)
                                 .set('limit',10)


    //Guardar en la variable resultado la respuesta de la URL con todos los GIF
    this.http.get<SearchGifsResponse>(`${this._servicioUrl}/search`,{params})
      .subscribe((res ) => {
        this.resultados=res.data;
        sessionStorage.setItem('ultimaBusqueda',JSON.stringify(res.data));
      })
      //Almacenamos en sesionStorage las ultimas URL de los gif mostrados
     
  }
}
