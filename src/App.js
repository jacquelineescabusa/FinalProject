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
                <div className="header">Customer Satisfaction Survey</div>
                   
                    
                </div>
                <div className="jumbotron">
                    <h2 className="text-center">YOU TALK... WE LISTEN!</h2><br/>
                                <Form>
                                    <FormGroup>
                                    <Table>
                                    <tr>
                                    <th>
                                        
                                        
                                        <FormControl name
                                            type="text"
                                            placeholder="ENTER FULLNAME"
                                            value={this.state.name}
                                            onChange={this.onChange('name')}
                                            />
                               </th>
                                        
                                       <th> <FormControl add
                                            type="text"
                                            placeholder="ENTER ADDRESS"
                                            value={this.state.address}
                                            onChange={this.onChange('address')}
                                            />
                                            </th>
                                            </tr>
                                            </Table>
                                    </FormGroup> 
                                       
                                    <FormGroup>
                                    <Table><tr><th>
                                        <ControlLabel>How was the services offered,is it better?</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="services"
                                                     value={this.state.services}
                                                     onChange={this.onChange('services')}
                                            >
                                            <option value="Was better than expected">Was better than expected</option>
                                            <option value="Matched expectations">Matched expectations</option>
                                            <option value="Was worse than expected">Was worse than expected</option>
                                        </FormControl></th>

                                        <th>
                                        <ControlLabel>How was the overall value you paid for?</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="paid"
                                                     value={this.state.paid}
                                                     onChange={this.onChange('paid')}
                                            >
                                            <option value="An exceptional value,">An exceptional value</option>
                                            <option value="A good value">A good value</option>
                                            <option value="A poor value">A poor value</option>
                                        </FormControl></th></tr></Table></FormGroup>
                                        
                                    <FormGroup>
                                        <ControlLabel>Overall, are you satisfied with the way the stablishment performed?</ControlLabel>
                                        <Table><tr><th>
                                        <Radio name="perform" value="Strongly Disagree"
                                               onChange={this.onChange('perform')}>Strongly Disagree</Radio>
                                        <Radio name="perform" value="Somewhat Disagree"
                                               onChange={this.onChange('perform')}>Somewhat Disagree</Radio>
                                       <Radio name="perform" value="Neither Agree nor Disagree"
                                               onChange={this.onChange('perform')}>Neither Agree nor Disagree</Radio></th>
                                       <th> <Radio name="perform" value="Somewhat Agree"
                                               onChange={this.onChange('perform')}>Somewhat Agree</Radio>
                                       <Radio name="perform" value="Strongly Agree"
                                               onChange={this.onChange('perform')}>Strongly Agree</Radio>
                                               </th></tr></Table>
                                    </FormGroup>
                                    
                                       
                                   
                                    <FormGroup>
                                   
                                        <ControlLabel>RECOMMEND US</ControlLabel>
                                         <Table><tr><th>
                                        <Checkbox value="FAMILY"
                                                  checked={this.state.recommend.indexOf('FAMILY')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                            FAMILY
                                        </Checkbox></th>
                                       <th> <Checkbox value="COLLEGUES"
                                                  checked={this.state.recommend.indexOf('COLLEGUES')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                            COLLEGUES
                                            </Checkbox></th>
                                       <th> <Checkbox value="COMMUNITY"
                                                  checked={this.state.recommend.indexOf('COMMUNITY')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                            COMMUNITY
                                        </Checkbox></th>
                                       <th> <Checkbox value="BATCH"
                                                  checked={this.state.recommend.indexOf('BATCH')>=0 ? true:false}
                                                  onChange={this.checkboxChange('recommend')}>
                                           BATCH
                                            
                                        </Checkbox></th></tr></Table>
                                    </FormGroup>
                                    <FormGroup>
                                            <ControlLabel>FEEDBACK FOR IMPROVEMENT</ControlLabel><br/>
                                        <textarea
                                            type="textarea"
                                            placeholder="Please share with us a few things!"
                                            value={this.state.feedback}
                                            onChange={this.onChange('feedback')}
                                            cols = "80"
                                            rows = "6"
                                                />
                                    </FormGroup>


                                    <ButtonGroup>

                                        <Button bsStyle="primary" onClick={this.saveSurvey}>Save Survey</Button>

                                    </ButtonGroup>
                                </Form>
                                </div>
                                
                        <div className="jumbotron">
                             <div className="header">RESULTS</div>
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
                                    <Table>
                                    <tr>
                                    <th>
                                        
                                        
                                        <FormControl name
                                            type="text"
                                            placeholder="ENTER FULLNAME"
                                            value={this.state.selectedName}
                                            onChange={this.modalonChange('selectedName')}
                                            />
                               </th>
                                        
                                       <th> <FormControl address
                                            type="text"
                                            placeholder="ENTER ADDRESS"
                                            value={this.state.selectedAddress}
                                            onChange={this.modalonChange('selectedAddress')}
                                            />
                                            </th>
                                            </tr>
                                            </Table>
                                    </FormGroup> 
                                       
                                    <FormGroup>
                                    <Table><tr><th>
                                        <ControlLabel>How was the services offered,is it better?</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="services"
                                                     value={this.state.selectedServices}
                                                     onChange={this.modalonChange('selectedServices')}
                                            >
                                            <option value="Was better than expected">Was better than expected</option>
                                            <option value="Matched expectations">Matched expectations</option>
                                            <option value="Was worse than expected">Was worse than expected</option>
                                        </FormControl></th>

                                        <th>
                                        <ControlLabel>How was the overall value you paid for?</ControlLabel>
                                        <FormControl componentClass="select"
                                                     placeholder="paid"
                                                     value={this.state.selectedPaid}
                                                     onChange={this.modalonChange('selectedPaid')}
                                            >
                                            <option value="An exceptional value,">An exceptional value</option>
                                            <option value="A good value">A good value</option>
                                            <option value="A poor value">A poor value</option>
                                        </FormControl></th></tr></Table></FormGroup>
                                        
                                    <FormGroup>
                                        <ControlLabel>Overall, are you satisfied with the way the stablishment performed?</ControlLabel>
                                        <Table><tr><th>
                                        <Radio name="selectedPerform" value="Strongly Disagree"
                                               onChange={this.modalonChange('selectedPerform')}>Strongly Disagree</Radio>
                                        <Radio name="selectedPerform" value="Somewhat Disagree"
                                               onChange={this.modalonChange('selectedPerform')}>Somewhat Disagree</Radio>
                                       <Radio name="selectedPerform" value="Neither Agree nor Disagree"
                                               onChange={this.modalonChange('selectedPerform')}>Neither Agree nor Disagree</Radio></th>
                                       <th> <Radio name="selectedPerform" value="Somewhat Agree"
                                               onChange={this.modalonChange('selectedPerform')}>Somewhat Agree</Radio>
                                       <Radio name="selectedPerform" value="Strongly Agree"
                                               onChange={this.modalonChange('selectedPerform')}>Strongly Agree</Radio>
                                               </th></tr></Table>
                                    </FormGroup>
                                    
                                       
                                   
                                    <FormGroup>
                                   
                                        <ControlLabel>RECOMMEND US</ControlLabel>
                                         <Table><tr><th>
                                        <Checkbox value="FAMILY"
                                                  checked={this.state.selectedRecommend.indexOf('FAMILY')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                            FAMILY
                                        </Checkbox></th>
                                       <th> <Checkbox value="COLLEGUES"
                                                  checked={this.state.selectedRecommend.indexOf('COLLEGUES')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                            COLLEGUES
                                            </Checkbox></th>
                                       <th> <Checkbox value="COMMUNITY"
                                                  checked={this.state.selectedRecommend.indexOf('COMMUNITY')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                            COMMUNITY
                                        </Checkbox></th>
                                       <th> <Checkbox value="BATCH"
                                                  checked={this.state.selectedRecommend.indexOf('BATCH')>=0 ? true:false}
                                                  onChange={this.modalcheckboxChange('selectedRecommend')}>
                                           BATCH
                                            
                                        </Checkbox></th></tr></Table>
                                    </FormGroup>
                                    <FormGroup>
                                            <ControlLabel>FEEDBACK FOR IMPROVEMENT</ControlLabel><br/>
                                        <textarea
                                            type="textarea"
                                            placeholder="Please share with us a few things!"
                                            value={this.state.selectedFeedback}
                                            onChange={this.modalonChange('selectedFeedback')}
                                            cols = "80"
                                            rows = "6"
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
