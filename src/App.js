import React from "react";
import "./App.css";

const INITIAL_SESSION_LENGTH = 25;
const initialState = {
  breakLength: 5,
  sessionLength: INITIAL_SESSION_LENGTH,
  timeLeft: INITIAL_SESSION_LENGTH * 60,  // store in seconds
  timerIsRunning: false,
  timerLabel: "Session"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.timerInterval = undefined;
    this.timerIntervalCallback = () => {
      this.setState(prevState => {
        if (prevState.timeLeft === 0) {
          document.getElementById("beep").play();
          if (prevState.timerLabel === "Session") {
            return {
              timeLeft: prevState.breakLength * 60,
              timerLabel: "Break"
            };
          } else {
            // it is a break currently, change to Session
            return {
              timeLeft: prevState.sessionLength * 60,
              timerLabel: "Session"
            };
          }
        } else {
          return {
            timeLeft: --prevState.timeLeft
          };
        }
      });
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.incrementBreak = this.incrementBreak.bind(this);
    this.decrementBreak = this.decrementBreak.bind(this);
    this.incrementSession = this.incrementSession.bind(this);
    this.decrementSession = this.decrementSession.bind(this);
  }

  incrementBreak() {
    this.setState(prevState => {
      return {
        breakLength:
          prevState.breakLength < 60
            ? ++prevState.breakLength
            : prevState.breakLength
      };
    });
  }
  decrementBreak() {
    this.setState(prevState => {
      return {
        breakLength:
          prevState.breakLength > 1
            ? --prevState.breakLength
            : prevState.breakLength
      };
    });
  }
  incrementSession() {
    this.setState(prevState => {
      return {
        sessionLength:
          prevState.sessionLength < 60
            ? ++prevState.sessionLength
            : prevState.sessionLength,
        timeLeft: prevState.sessionLength * 60
      };
    });
  }
  decrementSession() {
    this.setState(prevState => {
      return {
        sessionLength:
          prevState.sessionLength > 1
            ? --prevState.sessionLength
            : prevState.sessionLength,
        timeLeft: prevState.sessionLength * 60
      };
    });
  }

  toggleTimer() {
    this.setState(
      prevState => {
        return {
          timerIsRunning: !prevState.timerIsRunning
        };
      },
      () => {
        // after state has changed
        if (this.state.timerIsRunning) {
          this.timerInterval = setInterval(this.timerIntervalCallback, 1000);
        } else {
          clearInterval(this.timerInterval);
        }
      }
    );
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    document.getElementById("beep").load();
    this.setState(initialState);
  }

  render() {
    const minutes = parseInt(this.state.timeLeft / 60);
    const seconds = this.state.timeLeft % 60;
    const timeLeft = `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(
      -2
    )}`;

    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-3 m-2 py-3">
            <label id="break-label">Break Length</label>
            <div className="row justify-content-center">
            <button
                type="button"
                onClick={this.decrementBreak}
                id="break-decrement"
                >
                <ion-icon name="arrow-dropdown" />
              </button>
              <div type="number" id="break-length">
                {this.state.breakLength}
              </div>
              <button
                type="button"
                onClick={this.incrementBreak}
                id="break-increment"
                >
                <ion-icon name="arrow-dropup" />
              </button>
            </div>
          </div>

          <div className="col-md-3 m-2 py-3">
            <label id="session-label">Session Length</label>
            <div className="row justify-content-center">
              <button
                type="button"
                onClick={this.decrementSession}
                id="session-decrement"
              >
                <ion-icon name="arrow-dropdown" />
              </button>
              <div type="number" id="session-length">
                {this.state.sessionLength}
              </div>
              <button
                type="button"
                onClick={this.incrementSession}
                id="session-increment"
              >
                <ion-icon name="arrow-dropup" />
              </button>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="card px-5 py-3">
            <div className="card-body">
              <h3 id="timer-label" className="card-title">
                {this.state.timerLabel}
              </h3>
              <h6 className="card-subtitle mb-2" style={{color: this.state.timerIsRunning ? '#76ff03' : '#000a12'}} id="time-left">{timeLeft}</h6>
              <button id="start_stop" className="card-link" onClick={this.toggleTimer} type="button">
                {this.state.timerIsRunning ? (
                  <ion-icon name="pause" />
                ) : (
                  <ion-icon name="play" />
                )}
              </button>
              <button id="reset" className="card-link" onClick={this.resetTimer} type="button">
                <ion-icon name="refresh" />
              </button>
            </div>
          </div>
        </div>

        <audio id="beep" src="https://goo.gl/65cBl1" />
      </div>
    );
  }
}

export default App;
