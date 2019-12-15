import { Component, h, State, Prop, Method } from '@stencil/core';

@Component({
  tag:'datetime-picker',
  styleUrl:'./date-picker.css',
  shadow:true
})
export class DatePicker {
  //currDate is a fixed date that is used to calculate values relative to that populate matrix
  @Prop({ mutable: true, reflect: true }) currDate = new Date();
  @State() calendarMatrix= [];
  @State() showCalendar = false;
  @State() selectedDate = this.currDate.toISOString().slice(0, 16).replace(/-/g, "/").replace("T", " ");

  calendarMatrixPopulator() {
    //how far the first of the current month (whatever the state is set to) is from the start of the week
    let offset = new Date(this.currDate.getFullYear(), this.currDate.getMonth(), 1).getDay();

    this.calendarMatrix= [];
    for(let i = 0; i<42; i++) {
      this.calendarMatrix.push(new Date(this.currDate.getFullYear(), this.currDate.getMonth(), (1 - offset) + i, 0));
    }
    this.restructureMatrix();
  }

  //make private
  restructureMatrix() {
    let i,j
    let temparray;
    let outputArray = []

    let chunk = 7;
    for (i=0,j=this.calendarMatrix.length; i<j; i+=chunk) {
        temparray = this.calendarMatrix.slice(i,i+chunk);
        // do whatever
        outputArray.push(temparray);
    }

    this.calendarMatrix = outputArray;
  }
  //need a lifehook function that populates calendarMatrix before
  //this datepicker component loads
  @Method()
  async toggleCalendar() {

    this.showCalendar = !this.showCalendar
    return this.showCalendar

  }

  decrementMonth() {
    this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth() - 1);
  }

  incrementMonth() {
    this.currDate = new Date(this.currDate.getFullYear(), this.currDate.getMonth() + 1);
  }


  onHoursSelection(event) {
    let hour = event.path[0].value;
    this.currDate.setHours(hour)
    this.selectedDate = this.currDate.toISOString().slice(0, 16).replace(/-/g, "/").replace("T", " ")
  }

  onMinutesSelection(event) {
    let minute = event.path[0].value;
    this.currDate.setMinutes(minute)
    this.selectedDate = this.currDate.toISOString().slice(0, 16).replace(/-/g, "/").replace("T", " ")


  }

  onDayClick(date: Date) {
    this.currDate = date

    this.selectedDate = date.toISOString().slice(0, 16).replace(/-/g, "/").replace("T", " ")
    return this.selectedDate;

  }


  render() {


    //find a better place to do this as this array is created and assigned on every render
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let hours = Array.from(Array(24).keys());
    let minutes = Array.from(Array(60).keys());
    console.log(hours)
    //only want to change matrix before initial renders
    //and onMonth[/year]Increment and onMonth[/year]Increment
    this.calendarMatrixPopulator();


    return (
      <div>
        <input id="date-input" value={this.selectedDate.toString()}/>
        <button class="unstyled-button" onClick={this.toggleCalendar.bind(this)}>Calendar</button>

        <div id="main-content" class={{
          'is-closed':!this.showCalendar,
          'is-open': this.showCalendar
        }}>
          <h1>
            {months[this.currDate.getMonth()]} {this.currDate.getFullYear()}</h1>
            <div class="decrement-button">
              <button onClick={this.decrementMonth.bind(this)}>
                Back
              </button>
            </div>
            <div class="decrement-button">
              <button onClick={this.incrementMonth.bind(this)}>
                fwd
              </button>
            </div>


          <table>
          <th>Su</th>
          <th>Mo</th>
          <th>Tu</th>
          <th>We</th>
          <th>Th</th>
          <th>Fr</th>
          <th>Sa</th>

          {
          this.calendarMatrix.map((row) =>
          <tr>
            {row.map((day) =>
              <td>
                <button onClick={this.onDayClick.bind(this, day)}>
                  {day.getDate()}
                </button>
                </td>
                )
            }
          </tr>
            )
          }
        </table>


        <div id="time">
          {

            <select id="hours" onChange={(event: UIEvent) => this.onHoursSelection(event)}>
              <option  disabled selected>Hours:</option>
            {hours.map((hour) =>
                <option value={hour.toString()}>{hour}</option>
              )
            }


            </select>
            }

            {
            <select id="minutes" onChange={(event: UIEvent) => this.onMinutesSelection(event)}>
            <option  disabled selected>Minutes:</option>
            {minutes.map((minute) =>
                <option value={minute.toString()}>{minute}</option>
              )
            }


            </select>

            }

        </div>



        </div>

      </div>


    )
  }
}
