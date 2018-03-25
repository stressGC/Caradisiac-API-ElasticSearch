import React, { Component } from 'react';
import loading from './loading.gif';
import './App.css';


const API = '/api/';
const DEFAULT_QUERY = 'suv';

const loadingStyle = {
  margin:'auto',
  padding:'500 auto',
  width:'40%'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    fetch(API + DEFAULT_QUERY)
    .then(response => response.json())
    .then(data => this.setState({ data: data }));
  }

  Update(){
    this.setState({data:null});
    fetch(API + 'populate')
    .then(response => response.json())
    .then(() => this.componentDidMount());
  }

  Reset() {

    this.brandInput.value = "";
    this.modelInput.value = "";
    this.volumeminInput.value = "";
    this.volumemaxInput.value = "";

    fetch(API + DEFAULT_QUERY)
    .then(response => response.json())
    .then(data => this.setState({ data: data }));
  }

  Go_To_Href(url){
    window.open(url);
  }

  OrderBy(item){
    var temp_data = this.state.data;
    console.log(temp_data);
    if(item==='brand')
      temp_data.sort((a,b) => a.brand.localeCompare(b.brand));
    if(item==='model')
      temp_data.sort((a,b) => a.model.localeCompare(b.model));
    if(item==='name')
      temp_data.sort((a,b) => a.name.localeCompare(b.name));
    if(item==='volume')
      temp_data.sort((a,b) => a.volume.localeCompare(b.volume));

    this.setState({ data: temp_data });
  }

  Search(){

    var query_array = [];
    var query_str = "";


    const brandInput = this.brandInput.value;
    const modelInput = this.modelInput.value;
    const volumeminInput = this.volumeminInput.value;
    const volumemaxInput = this.volumemaxInput.value;

    if(brandInput!=="")
      query_array.push("brand="+brandInput);

    if(modelInput!=="")
      query_array.push("model="+modelInput);

    if(volumeminInput!=="")
      query_array.push("volumemin="+volumeminInput);

    if(volumemaxInput!=="")
      query_array.push("volumemax="+volumemaxInput);

    if(query_array.length>0){
      query_str = "suv?";

      query_array.forEach(function(elem){

        if(query_str ==="suv?")
          query_str+=elem;
        else
          query_str+="&"+elem;

      });

      console.log(query_str);

      fetch(API + query_str)
      .then(response => response.json())
      .then(data => this.setState({ data: data }));
    }
    else{
      fetch(API + DEFAULT_QUERY)
      .then(response => response.json())
      .then(data => this.setState({ data: data }));
    }

  }


  render() {
    const { data } = this.state;
    if(data){
      return (

        <div id='root' className="container" style={{padding:'160px'}}>

        <div id="container_form" className="container-fluid" style={{margin: 'auto'}}>
        <form className="form-inline">
        <div className="form-group" style={{'marginRight': '10px'}}>
        <label htmlFor="brandInput" style={{'marginRight': '10px'}}>Brand name</label>
        <input type="text" className="form-control" ref={(brandInput) => { this.brandInput = brandInput }} placeholder="Enter brand"/>
        </div>
        <div className="form-group" style={{'marginRight': '10px'}}>
        <label htmlFor="modelInput" style={{'marginRight': '10px'}}>Model name</label>
        <input type="text" className="form-control" ref={(modelInput) => { this.modelInput = modelInput }} placeholder="Enter model name"/>
        </div>
        <div className="form-group" style={{'marginRight': '10px'}}>
        <label htmlFor="volumeminInput" style={{'marginRight': '10px'}}>Volume min</label>
        <input type="number" className="form-control" ref={(volumeminInput) => { this.volumeminInput = volumeminInput }} placeholder="0"/>
        </div>
        <div className="form-group" style={{'marginRight': '10px'}}>
        <label htmlFor="volumemaxInput" style={{'marginRight': '10px'}}>Volume max</label>
        <input type="number" className="form-control" ref={(volumemaxInput) => { this.volumemaxInput = volumemaxInput }} placeholder="0"/>
        </div>
        <button type="button" className="btn btn-primary" onClick={()=>{this.Search()}}>Submit</button>
        </form>
        </div>

        <button type="button" className="btn btn-primary" onClick={()=>{this.Update()}} style={{'marginRight': '10px'}}>Update</button>
        <button type="button" className="btn btn-primary" onClick={()=>{this.Reset()}}>Reset</button>
        <br/>
        <br/>

        <table className="table table-hover table-bordered table-hover-cells">
        <thead>
        <tr>
        <th scope="col-sm-auto" onClick={()=>{this.OrderBy('brand')}}>Brand</th>
        <th scope="col-sm-auto" onClick={()=>{this.OrderBy('model')}}>Model</th>
        <th scope="col-sm-auto" onClick={()=>{this.OrderBy('name')}}>Name</th>
        <th scope="col-sm-auto" onClick={()=>{this.OrderBy('volume')}}>Volume</th>
        </tr>
        </thead>
        <tbody>
        {data.map(object =>
        //FOREACH
        <tr className='clickable-row' href={object.url} onClick={()=>{this.Go_To_Href(object.url)}}>
        <th scope="row">{object.brand}</th>
        <td>{object.model}</td>
        <td>{object.name}</td>
        <td>{object.volume.length > 0 ? object.volume : '???'}</td>
        </tr>
        )}
        </tbody>

        </table>
        </div>
        );

    }
    else
      return (
        <div className="image-container" style={{padding:'160px auto'}}>
        <img src={loading} alt="loading" style={loadingStyle}/>
        </div>
        );
  }
}

export default App;
