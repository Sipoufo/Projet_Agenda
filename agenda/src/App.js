import {Inject ,ScheduleComponent, Day, Week, Month, Agenda} from '@syncfusion/ej2-react-schedule'

function App() {
  return (
    <ScheduleComponent currentView= "Month">
      <Inject services={[Day, Week, Month, Agenda]} />
    </ScheduleComponent>
  );
}

export default App;