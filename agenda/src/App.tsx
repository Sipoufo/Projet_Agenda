import React from 'react';
import './App.css';
import { ScheduleComponent, Inject, Day, Week, Month, Agenda, ViewDirective, ViewsDirective, DragAndDrop, Resize } from '@syncfusion/ej2-react-schedule';
import {Modal} from './components/addEvent';
import { Form, Row, Button } from 'react-bootstrap';

class App extends React.Component<{}, any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
      showDateTime: false,
      dataAgenda: [],
      Subject: "",
      Location: "",
      StartTime: new Date(),
      EndTime: new Date(),
      Description: "",
    };

  }

  // toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen});
  // dataAgenda: Object[] = []

  componentDidMount() {
    fetch("http://localhost:5000/agenda/getAllActivity")
      .then(res => res.json())
      .then((data): void => {
          console.log(data);
          let dataF: {id: number, Subject: string, StartTime: Date, EndTime:Date, ident: any};
          for (let i = 0; i < data.result.length; i++) {
            dataF = {
              id: i+1,
              ident: data.result[i]._id, 
              Subject: data.result[i].Subject,
              StartTime: new Date(data.result[i].StartTime), 
              EndTime: new Date(data.result[i].EndTime)
            }
            this.state.dataAgenda.push(dataF);
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  // 
  EventAction(args: any): void {
    var myHeaders = new Headers();
    var requestOptions;
    myHeaders.append("Content-Type", "application/json");
    
    if (args.requestType === 'eventCreated') {
      const data = args.addedRecords;
      for (let i = 0; i < data.length; i++) {
        requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(data[i]),
        };
        fetch("http://localhost:5000/agenda/addActivity", requestOptions)
          .then(result => {
            console.log(result);
          })
          .catch(error => console.log('error', error));
      }
    }
    
    if (args.requestType === 'eventChanged') {
      console.log(args.changedRecords)
      const data = args.changedRecords;
      for (let i = 0; i < data.length; i++) {
        requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: JSON.stringify(data[i]),
        };
        fetch(`http://localhost:5000/agenda/putActivity`, requestOptions)
          .then(result => {
            console.log("res",result);
          })
          .catch(error => console.log('error', error));
      }
    }
    if(args.requestType === 'eventRemoved') {
      const data = args.deletedRecords;
      for (let i = 0; i < data.length; i++) {
        const id = data[i].ident;
        requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
        };
        fetch(`http://localhost:5000/agenda/deleteOneActivity/${id}`,requestOptions)
          .then(result => {
            console.log("res",result);
          })
          .catch(error => console.log('error', error));
      }
    }
  }

  showDatetimeAtt(): void {
    this.setState({ showDateTime: !this.state.showDateTime});
    const inputStart = document.getElementById('start');
    const inputEnd = document.getElementById('end');

    if(this.state.showDateTime){
      inputStart?.removeAttribute("type");
      inputStart?.setAttribute("type", "datetime-local");
      inputEnd?.removeAttribute("type");
      inputEnd?.setAttribute("type", "datetime-local");
    } else {
      inputStart?.removeAttribute("type");
      inputStart?.setAttribute("type", "date");
      inputEnd?.removeAttribute("type");
      inputEnd?.setAttribute("type", "date");
    }
  }

  onSubmitForm(): void {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "Subject": this.state.Subject,
      "Location": this.state.Location,
      "StartTime": this.state.StartTime,
      "EndTime": this.state.EndTime,
      "Description": this.state.Description,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:5000/agenda/addActivity", requestOptions)
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  render() {
    return (
      <div>
        <div className='modalAgenda'>
          <button className={'app__btn'} onClick={() => this.setState({ isModalOpen: !this.state.isModalOpen})}>
            Add Event
          </button>
          <Modal title={'Add Event'} isOpen={this.state.isModalOpen} onClose={() => this.setState({ isModalOpen: !this.state.isModalOpen})} >
          <Form onSubmit={() => {this.onSubmitForm()}}>
            <Row className="mb-3">
              <Form.Group className="col-md-6" controlId="formGridEmail">
                <Form.Label>Title</Form.Label>
                <Form.Control className="fm" type="text" placeholder="Title" onChange={(e) => {this.setState({ Subject: e.target.value})}} required />
              </Form.Group>

              <Form.Group className="col-md-6" controlId="formGridPassword">
                <Form.Label>Location</Form.Label>
                <Form.Control className="fm" type="text" placeholder="Location" onChange={(e) => {this.setState({ Location: e.target.value})}} required />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group className="col-md-6" controlId="formGridEmail">
                <Form.Label>Start</Form.Label>
                <Form.Control className="fm" type="datetime-local" id="start" placeholder="Start" onChange={(e) => {this.setState({ StartTime: e.target.value})}} required />
              </Form.Group>

              <Form.Group className="col-md-6" controlId="formGridPassword">
                <Form.Label>End</Form.Label>
                <Form.Control className="fm" type="datetime-local" id="end" placeholder="End" onChange={(e) => {this.setState({ EndTime: e.target.value})}} required />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" id="formGridCheckbox">
              <Form.Check type="checkbox" label="All day" onClick={() => this.showDatetimeAtt()} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Form.Control className="fm" as="textarea" onChange={(e) => {this.setState({ Description: e.target.value})}} rows={3} required />
            </Form.Group>
            <Button variant="danger" className="" type="submit">
              Submit
            </Button>
          </Form>
          </Modal>
        </div>
        <div>
          <ScheduleComponent currentView="Month" selectedDate= {new Date()} allowMultiDrag={true} eventSettings={ { dataSource: this.state.dataAgenda } } actionComplete={this.EventAction.bind(this)} >
            <ViewsDirective>
              <ViewDirective option="Day" interval={3} />
              <ViewDirective option="Week"/>
              <ViewDirective option="Month"/>
              <ViewDirective option="Agenda"/>
            </ViewsDirective>
            <Inject services={[Day, Week, Month, Agenda, DragAndDrop, Resize]} />
          </ScheduleComponent>
        </div>
      </div>
      )
  }
}

export default App;
