import React, { Component } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import httpClient from 'axios'
import {
    Button,ButtonGroup,
    Form,FormGroup,ControlLabel,
    FormControl,HelpBlock,
    Checkbox,Radio,Grid,Row,Col,
    Table,Modal
} from 'react-bootstrap';


class App extends Component {
constructor (){
    super ()
}


    state = {
        name: "",
        address: "",
        services: "",
        paid: "",
        perform: "",
        recommend: [],
        feedback: "",
        records:[],
        show: false,
        selectedName: "",
        selectedAddress: "",
        selectedServices: "",
        selectedPaid: "",
        selectedPerform: "",
        selectedRecommend: [],
        selectedFeedback: "",
        selectedId: ""
    };

    componentDidMount(){

        this.refreshData();
    }



     refreshData=()=>{

         httpClient.get('http://localhost:3004/surveys')
             .then((response)=> {
                 var data =response.data;
                 this.setState({
                     records:data
                 })

             }).catch((error)=> {

             });

     };

    onChange = (fieldName)=> {
        return (event)=> {

            console.log(event.target.value);
            var state = this.state;
            state[fieldName] = event.target.value;
            this.setState(state);
        }
    };
   modalonChange = (fieldName)=> {
        return (event)=> {

            console.log(event.target.value);
            var state = this.state;
            state[fieldName] = event.target.value;
            this.setState(state);
        }
    };  

    checkboxChange = (fieldName)=> {
        return (event)=> {
            var targetArray = this.state[fieldName];
            if (targetArray.indexOf(event.target.value) >= 0)
                targetArray.splice(
                    targetArray.indexOf(event.target.value),
                    1
                );
            else
                targetArray.push(event.target.value);

            var state = this.state;
            state[fieldName] = targetArray;
            this.setState(state);
        }
    };

    modalcheckboxChange = (fieldName)=> {
        return (event)=> {
            var targetArray = this.state[fieldName];
            if (targetArray.indexOf(event.target.value) >= 0)
                targetArray.splice(
                    targetArray.indexOf(event.target.value),
                    1
                );
            else
                targetArray.push(event.target.value);

            var state = this.state.selectedRecommend;
            state[fieldName] = targetArray;
            this.setState(state.selectedRecommend);
        }
    };



    saveSurvey = ()=> {

        var data = {name:this.state.name,
                    address:this.state.address,
                    services:this.state.services,
                    paid:this.state.paid,
                    perform:this.state.perform,
                    recommend:this.state.recommend,
                    feedback:this.state.feedback};
        console.log(data);
         delete data.records;

        httpClient.post('http://localhost:3004/surveys',
         data)
            .then((response)=> {
                this.refreshData();
            }).catch((error)=> {

            });
      
location.reload();
    };

    deleteItem = (id)=>{

        return ()=>{

            httpClient.delete('http://localhost:3004/surveys/'+ id )
                .then((response)=> {

                    this.refreshData();
                }).catch((error)=> {

                });

        };
    };

editItem = (id) =>{
        return ()=> {
            
            httpClient.get('http://localhost:3004/surveys/'+id)
                .then((response)=> {
                    console.log('edit');
                    var data = response.data
                    console.log(response.data);
                    this.setState({
                        name: data.name,
                        
                        services: data.services
    
                    })
                }).catch((error)=>{
                    
                });
        };
    };
    openModal = (id)=>{

            return ()=>{
                this.setState({
                    show: true
                })

                 httpClient.get('http://localhost:3004/surveys/'+id)
                .then((response)=> {
                    var data = response.data
                    this.setState({
                        selectedName: data.name,
                        selectedAddress: data.address,
                        selectedServices: data.services,
                        selectedPaid: data.paid,
                        selectedPerform: data.perform,
                        selectedRecommend: data.recommend,
                        selectedFeedback: data.feedback,
                        selectedId: data.id
                    })
                    console.log(this.state.selectedData.name);
                }).catch((error)=>{
                    
                });

            };
        };

saveEdit = (id) =>{


        return () => {
            console.log(data);
            var data = {name:this.state.selectedName,
                        address:this.state.selectedAddress,
                        services:this.state.selectedServices,
                        paid:this.state.selectedPaid,
                        perform:this.state.selectedPerform,
                        recommend:this.state.selectedRecommend,
                        feedback:this.state.selectedFeedback};
            delete data.records;

            httpClient.patch('http://localhost:3004/surveys/'+id,
            data)
                .then((response)=> {
                    this.refreshData();
                }).catch((error)=> {

                });

            this.setState({
                show: false,
                    selectedName: "",
                    selectedAddress: "",
                    selectedServices: "",
                    selectedPaid: "",
                    selectedPerform: "",
                    selectedRecommend: [],
                    selectedFeedback: "",
            });
        }
    };
    render() {

        var rows  = this.state.records.map((item,i)=>{

            return (
                <tr key={i}>
                     <td><Button bsSize="xsmall" bsStyle="warning" onClick={this.deleteItem(item.id)}>DELETE</Button><br/><br/>
                     <Button bsSize="xsmall" bsStyle="danger"  onClick={this.openModal(item.id)}>EDIT</Button></td>
                     <td>{item.id}</td>
                     <td className="textfieldarea">{item.name}</td>
                     <td className="textfieldarea">{item.address}</td>
                     <td>{item.services}</td>
                     <td>{item.paid}</td>
                    <td>{item.perform}</td>
                     <td>{
                         item.recommend.map((recommend, mi)=> {
                             return <div key={mi}>
                                   <span className="label label-info">{recommend}</span>
                                 </div>
                         })

                      }
                     </td>
                     <td className="textfieldarea">{item.feedback}</td>
                </tr>
            );
        });

        let close =() => this.setState({show:false})
        return (
            <div className="container">
                <div className="page-header">
                <h2 className="text-center">ABSENCE REQUEST FORM</h2>
                   
                    
                </div>
                <div className="jumbotron">
                    
                                <Form>
                                    <FormGroup>
                                    
                                        
                                        <ControlLabel>EMPLOYEE NAME:</ControlLabel>
                                        <FormControl name
                                            type="text"
                                           
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                            />
                            
                                        <ControlLabel>EMPLOYEE NUMBER:</ControlLabel>
                                        <FormControl add
                                            type="text"
                                        
                                            value={this.state.address}
                                            onChange={this.onChange('address')}
                                            />
                                         
                                          <ControlLabel>MANAGER:</ControlLabel>
                                        <FormControl add
                                            type="text"
                                            
                                            value={this.state.paid}
                                            onChange={this.onChange('paid')}
                                            />
                                         
                                    </FormGroup> 
                                    
                                        <FormGroup>
                                        <ControlLabel>Gender</ControlLabel>
                                       
                                        <Radio name="perform" value="Male"
                                               onChange={this.onChange('perform')}>Male</Radio>
                                        <Radio name="perform" value="Female"
                                               onChange={this.onChange('perform')}>Female</Radio>
                                    
                                    
                                               
                                    </FormGroup>
                                    <FormGroup>
                                   
                                        <ControlLabel>DEPARTMENT</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="services"
                                                     value={this.state.services}
                                                     onChange={this.onChange('services')}
                                            >
                                            <option value="HR">HR</option>
                                            <option value="FACILITIES">FACILITIES</option>
                                            <option value="FINANCE">FINANCE</option>
                                        </FormControl>

                                        
                                        <ControlLabel>How was the overall value you paid for?</ControlLabel>
                                       </FormGroup>
                                        
                                   
                                    
                                       
                                   
                                   
                                    <FormGroup>
                                        <ControlLabel>TYPES OF ABSENCE REQUEST </ControlLabel>
                                        <Checkbox value="SICK"
                                                  checked={this.state.recommend.indexOf('SICK')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                           SICK
                                        </Checkbox> 
                                        <Checkbox value="VACATION"
                                                  checked={this.state.recommend.indexOf('VACATION')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                          VACATION
                                        </Checkbox>
                                        <Checkbox value="DURY DUTY"
                                                  checked={this.state.recommend.indexOf('DURY DUTY')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                       DURY DUTY
                                       
                                        </Checkbox>
                                        <Checkbox value="BEREAVEMENT"
                                                  checked={this.state.recommend.indexOf('BEREAVEMENT')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                     BEREAVEMENT
                                        </Checkbox>
                                        <Checkbox value="MANATERNITY/PATERNITY"
                                                  checked={this.state.recommend.indexOf('MANATERNITY/PATERNITY')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                      MANATERNITY/PATERNITY
                                       
                                        </Checkbox>
                                        <Checkbox value="OTHERS"
                                                  checked={this.state.recommend.indexOf('OTHERS')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                     OTHERS
                                       
                                        </Checkbox>
                                    </FormGroup>
                                    
                                    
                                    
                                    <FormGroup>
                                        <ControlLabel>REASON FOR ABSENCE:   </ControlLabel><br/>
                                        <textarea
                                            type="textarea"
                                            placeholder=""
                                            value={this.state.feedback}
                                            onChange={this.onChange('feedback')}
                                            cols="160"
                                            rows="8"
                                            />
                                    </FormGroup>
                                   

                                    <ButtonGroup>

                                        <Button bsStyle="primary" onClick={this.saveSurvey}>Save Survey</Button>

                                    </ButtonGroup>
                                </Form>
                                </div>
                                
                        <div className="jumbotron">
                           
                                <Table condensed striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th className="text-center">ACTION</th>
                                       
                                        <th className="text-center">ID</th>
                                        <th className="text-center">FULLNAME</th>
                                        <th className="text-center">ADDRESS</th>
                                        <th className="text-center">SERVICES</th>
                                        <th className="text-center">VALUE</th>
                                        <th className="text-center">SATISFACTION</th>
                                        <th className="text-center">RECOMMEND</th>
                                        <th className="text-center">FEEDBACK</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {rows}
                                    </tbody>
                                </Table>
                                </div>
                    <div className="modal-container" style={{height: 200}}>
                    <Modal
                    show={this.state.show}
                    onHide={close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                     <Form>
                                    <FormGroup>
                                    
                                        
                                        <ControlLabel>EMPLOYEE NAME:</ControlLabel>
                                        <FormControl name
                                            type="text"
                                           
                                            value={this.state.selectedName}
                                            onChange={this.modalonChange('selectedName')}
                                            />
                            
                                        <ControlLabel>EMPLOYEE NUMBER:</ControlLabel>
                                        <FormControl add
                                            type="text"
                                        
                                            value={this.state.selectedAddress}
                                            onChange={this.modalonChange('selectedAddress')}
                                            />
                                         
                                          <ControlLabel>MANAGER:</ControlLabel>
                                        <FormControl add
                                            type="text"
                                            
                                            value={this.state.selectedPaid}
                                            onChange={this.modalonChange('selectedPaid')}
                                            />
                                         
                                    </FormGroup> 
                                    
                                        <FormGroup>
                                        <ControlLabel>Gender</ControlLabel>
                                       
                                        <Radio name="perform" value="Male"
                                               onChange={this.modalonChange('selectedPerform')}>Male</Radio>
                                        <Radio name="perform" value="Female"
                                               onChange={this.modalonChange('selectedPerform')}>Female</Radio>
                                    
                                    
                                               
                                    </FormGroup>
                                    <FormGroup>
                                   
                                        <ControlLabel>DEPARTMENT</ControlLabel>
                                        <FormControl componentClass="select"
                                                    
                                                     value={this.state.selectedServices}
                                                     onChange={this.modalonChange('selectedServices')}
                                            >
                                            <option value="HR">HR</option>
                                            <option value="FACILITIES">FACILITIES</option>
                                            <option value="FINANCE">FINANCE</option>
                                        </FormControl>

                                        
                                        
                                       </FormGroup>
                                        
                                   
                                    
                                       
                                   
                                   
                                    <FormGroup>
                                        <ControlLabel>TYPES OF ABSENCE REQUEST </ControlLabel>
                                        <Checkbox value="SICK"
                                                  checked={this.state.selectedRecommend.indexOf('SICK')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                           SICK
                                        </Checkbox> 
                                        <Checkbox value="VACATION"
                                                  checked={this.state.selectedRecommend.indexOf('VACATION')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                          VACATION
                                        </Checkbox>
                                        <Checkbox value="DURY DUTY"
                                                  checked={this.state.selectedRecommend.indexOf('DURY DUTY')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                       DURY DUTY
                                       
                                        </Checkbox>
                                        <Checkbox value="BEREAVEMENT"
                                                  checked={this.state.selectedRecommend.indexOf('BEREAVEMENT')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                     BEREAVEMENT
                                        </Checkbox>
                                        <Checkbox value="MANATERNITY/PATERNITY"
                                                  checked={this.state.selectedRecommend.indexOf('MANATERNITY/PATERNITY')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                      MANATERNITY/PATERNITY
                                       
                                        </Checkbox>
                                        <Checkbox value="OTHERS"
                                                  checked={this.state.selectedRecommend.indexOf('OTHERS')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                     OTHERS
                                       
                                        </Checkbox>
                                    </FormGroup>
                                    
                                    
                                    
                                    <FormGroup>
                                        <ControlLabel>REASON FOR ABSENCE:   </ControlLabel><br/>
                                        <textarea
                                            type="textarea"
                                            placeholder=""
                                            value={this.state.selectedFeedback}
                                            onChange={this.modalonChange('selectedFeedback')}
                                            cols="90"
                                            rows="8"
                                            />
                                    </FormGroup>
                                   
                                    <ButtonGroup>

                                        <Button bsStyle="primary" onClick={this.saveEdit(this.state.selectedId)}>Save Edit</Button>

                                    </ButtonGroup>
                                </Form>
                                </Modal.Body>
                                </Modal>
                                </div></div>
            
        );
    }
}

export default App;



