import React,{Component} from 'react';
import Buscador from './components/Buscador';
import Resultado from './components/Resultado';
import './App.css';
class App extends Component{
  state={
    termino: '',
    imagenes: [],
    pagina: '',
    cargando: false
  }

  consultarAPI = async () => {
    const termino = this.state.termino;
    const pagina = this.state.pagina;
    const url = `https://pixabay.com/api/?key=14041957-72613465ed5bac598477f9f2f&q=${termino}&per_page=30&page=${pagina}`;
    console.log(url)
    await fetch(url)
    .then(respuesta => {
      this.setState({
        cargando: true
      });
      return respuesta.json()
    })
    .then(resultado => {
      setTimeout(()=>{

        this.setState({
          imagenes: resultado.hits,
          cargando: false
        })

      },2000);
    })
  }

  datosBusqueda = (termino) =>{
    this.setState({
      termino : termino,
      pagina : 1
    }, ()=>{
      this.consultarAPI();
    })
  }

  paginaAnterior = () =>{
    //leemos state
    let pagina = this.state.pagina;
    //si es la pagina 1 ya no podemos retroceder
    if(pagina === 1) return null;
    //restar la pagina actual
    pagina -=1;
    //agregamos al state
    this.setState({
      pagina
    },()=>{
      this.consultarAPI();
      this.scroll();
    });
  }
  paginaSiguiente = () =>{
    let pagina = this.state.pagina;
    pagina +=1;
    this.setState({
      pagina
    },()=>{
      this.consultarAPI();
      this.scroll();
    });
  }
  scroll = ()=>{
    const elemento = document.querySelector('#resultado');
    elemento.scrollIntoView('auto','start');
  }
  render(){
    const cargando = this.state.cargando;
    let resultado;
    if(cargando){
      resultado = <div className="spinner">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                  </div>
    }else{
      resultado= <Resultado
      imagenes={this.state.imagenes}
      paginaAnterior= {this.paginaAnterior}
      paginaSiguiente={this.paginaSiguiente}
    />
    }

    return (
    <div className="app container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imágenes</p>
        <Buscador
          datosBusqueda={this.datosBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        {resultado}
      </div>
    </div>
  );
  }
}

export default App;
