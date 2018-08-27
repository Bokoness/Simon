const SimonButton = (props) => {
  return (
  <div
    className={props.class}
    //will Click the simon's buttons only if game is active
    onClick={(props.gameActive && props.isUserTurn)? props.handleClick : ""}
  >
  </div>
)};
//The on and off button component
const OnOff = (props) => {
  return (
  <div className="onOff" onClick={props.toggleGame}>
    {props.gameActive ?
      <div className="on"></div>
      :
      <div className="off"></div>
    }
  </div>
)};
//The choose level screen
const LevelScreen = (props) => {
  return (
    <div className="levelScreenWrapper">
      <i onClick={props.levelUp} className="fa fa-arrow-up levelScreenButton" aria-hidden="true"></i>
      <div className="levelScreen">
        {props.gameActive? props.levelsToWin : "--"}
      </div>
      <i onClick={props.levelDown} className="fa fa-arrow-down levelScreenButton" aria-hidden="true"></i>

    </div>
  )
}
//The middle circle menu component
const SimonMenu = (props) => {
  return (
  <div className="simonMenu">
    <div className="menuButtonRow">
      <div className="menuBottonCol">
        <h1 className="gameTitle">Simon</h1>
        <div className="screen"><span className="screenContent">{props.title}</span></div>
        <span className="screenTitle">LEVEL</span>
      </div>
    </div>
    <div className="menuButtonRow">
      <button
        className="restartButton"
        onClick={props.startSession}
      >Restart
      </button>
      <div className="menuBottonCol">
        <OnOff gameActive={props.gameActive} toggleGame={props.toggleGame}/>
        <span>ON/OFF</span>
      </div>
      <button
        className={props.strictMode? "strictButtonPressed" : "strictButton"}
        onClick={props.handleStrictMode}
      >Strict
      </button>
    </div>
      <LevelScreen 
        levelsToWin={props.levelsToWin}
        levelUp={props.levelUp}
        levelDown={props.levelDown}
        gameActive={props.gameActive}
      />
    <div className="levelLabel">MAX LEVEL</div>
  </div>
)};

//the main component
class Simon extends React.Component {
  constructor() {
    super();
//================ State ===============//
    this.state = {
      levelsToWin: 20, //change this state to setup the number of levels
      session: [],
      userSession: [],
      title: "--",
      gameActive: false,
      isUserTurn: false,
      strictMode: false,
      isGreenOn: false,
      isRedOn: false,
      isYellowOn: false,
      isBlueOn: false
    };
  };

  //Handles the sound of the buttons
  doSound(color) {
    let sound = document.createElement ("AUDIO");
    switch(color){
      case "green": {
        sound.setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
        sound.setAttribute("autoplay", "autoplay");
      }
        break;
      case "red": {
        sound.setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
        sound.setAttribute("autoplay", "autoplay");
      }
        break;
      case "yellow": {
        sound.setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
        sound.setAttribute("autoplay", "autoplay");
      }
        break;
      case "blue": {
        sound.setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
        sound.setAttribute("autoplay", "autoplay");
      }
        break;
      case "error": {
        this.doSound('yellow');
        this.doSound('blue');
        this.doSound('yellow');
        this.doSound('blue');
      }
    }
  }

  //Handles the lights of the buttons
  doLight(color) {
    switch(color){
      case "green": {
        this.setState ({
          isGreenOn: true,
          isRedOn: false,
          isYellowOn: false,
          isBlueOn: false
        });
        setTimeout (() => this.setState ({isGreenOn: false}), 450);
      }
        break;
      case "red": {
        this.setState ({
          isGreenOn: false,
          isRedOn: true,
          isYellowOn:false,
          isBlueOn: false
        });
        setTimeout (() => this.setState ({isRedOn: false}), 450);
      }
        break;
      case "yellow": {
        this.setState ({
          isGreenOn: false,
          isRedOn: false,
          isYellowOn: true,
          isBlueOn: false
        });
        setTimeout (() => this.setState ({isYellowOn: false}), 450);
      }
        break;
      case "blue": {
        this.setState ({
          isGreenOn: false,
          isRedOn: false,
          isYellowOn:false,
          isBlueOn: true
        });
        setTimeout (() => this.setState ({isBlueOn: false}), 450);
      }
      break;
      case "error": {
        this.setState ({
          isGreenOn: true,
          isRedOn: true,
          isYellowOn:true,
          isBlueOn: true
        });
        setTimeout (() => this.setState ({
          isGreenOn: false,
          isRedOn: false,
          isYellowOn:false,
          isBlueOn: false
        })
          , 450);
      }
    }
  }

  //toggles strict mode
  handleStrictMode() {
    //if game isn't active - cant press strict button
    if(!this.state.gameActive)
      return;
    this.setState({strictMode: !this.state.strictMode});
  }

  //Turn the game on and off
  toggleGame() {
    //Turning all lights for half a second when activating the game
    if (!this.state.gameActive) {
      this.setState ({
        isGreenOn: true,
        isRedOn: true,
        isYellowOn: true,
        isBlueOn: true,
        session: [],
        userSession:[],
        title: 0,
        isUserTurn: false,
        gameActive: true,
        isRestarting: false,
      });
      setTimeout (() => this.setState ({
        isGreenOn: false,
        isRedOn: false,
        isYellowOn: false,
        isBlueOn: false,
      }), 500);
    }
    else
      this.setState ({
        gameActive: false,
        title: "--"
      });
  }

  //restarts the game
  startSession() {
    //if game isn't active - cant press restart button
    if(!this.state.gameActive)
      return;
    //if already restarting - cant press restart button
    if(this.state.isRestarting)
      return;

    this.setState({
      isRestarting: true, //user cant click restart button
      title: 0,
      isUserTurn: false,
      session: [],
      userSession: []
    });
    setTimeout( () => this.addToSession(0), 1000);
  };

  //adding another button to computer's session
  addToSession() {
    let tempSession = this.state.session, level = this.state.title;
    //if user finished all session (won)
    if(tempSession.length ===  this.state.levelsToWin) {
      this.setState({
        session: [],
        userSession: [],
        isUserTurn: false,
        title: "WON"
      });
      return this.userWon("green");
    }
    //if user succeed in current session, but didn't finish whole session
    let session = doRandomColor();
    let len = this.state.session.length;
        //prevent computer to add same button 3 times
    if(tempSession.len >= 2 && session === tempSession[len-1] && session === tempSession[tempSession.length-2]){
      return session();
    }
        //adding a button to computer's session
    tempSession.push(session);
    level++;
    this.setState({session: tempSession, title:level});
    this.doSession(0);
  };

  //Computer represent the current session without adding another button
  doSession(count, title) {
    //if computer finish representing button's session
    if(count === this.state.session.length) {
      this.setState({
        isUserTurn: true,
        //user can click restart button again
        isRestarting: false
      });
      return;
    }
    //if title was error - title returns to last title
    if(title) {
      this.setState({title: title});
    }
    this.doSound(this.state.session[count]);
    this.doLight(this.state.session[count]);
    count ++;
    setTimeout(()=> this.doSession(count) ,500);
  }

  compareUserClickToSession(userSession, i) {
    this.setState({
      isUserTurn: true,
      userSession: userSession,
    });

    for(let i = 0; i < userSession.length; i++) {
      //if user pushed the CORRECT buttons
      if(i === this.state.session.length -1  && this.state.session[i] === userSession[i]) {
        this.setState({
          userSession: [],
          isUserTurn: false
        });
        return setTimeout( () => this.addToSession(0), 1000);
      }

      //if user pushed the WRONG buttons
      if(this.state.userSession[i] !== this.state.session[i]) {
        let title = this.state.title; //handles the Error title
        this.doSound('error');
        this.setState({userSession: [], isUserTurn: false, title: "!!!"});

        //if strict mode is on
        if(this.state.strictMode)//start a new session
          setTimeout( () => this.startSession(), 1000);
        else //starts the current session again
          setTimeout( () => this.doSession(0, title), 1000);
      }
    }
  };

  //handles the 4 buttons. changing their colors and sounds
  handleButtonClick(color) {
    let userSession = this.state.userSession;
    userSession.push(color);
    this.setState({userSession: userSession});
    this.doLight(color);
    this.doSound(color);
    this.compareUserClickToSession(userSession, 0);
  }
  //do special lights and sounds when user won
  userWon(color, round) {
    if(color === "green") {
      this.doSound(color);
      this.doLight(color);
      setTimeout(() => this.userWon("red"),300)
    }
    else if(color === "red") {
      this.doSound(color);
      this.doLight(color);
      setTimeout(() => this.userWon("blue"),300)
    }
    else if(color === "blue") {
      this.doSound(color);
      this.doLight(color);
      setTimeout(() => this.userWon("yellow"),300)
    }
    else if(color === "yellow") {
      this.doSound(color);
      this.doLight(color);
      return;
    }
  }
  //handle the max-level setup
  levelUp() {
    let levelsToWin = this.state.levelsToWin + 1;
    this.setState({levelsToWin: levelsToWin});
  }
  levelDown() {
    //1 is the minimum level
    if(this.state.levelsToWin <= 1)
      return;
    let levelsToWin = this.state.levelsToWin -1 ;
    this.setState({levelsToWin: levelsToWin});
  }

//================ Render =====================
  render() {
    return (
      <div className="simon">
        <h3>Made by Bokoness</h3>
        <div className="simonBody">
          <div className="buttonRow">
            <SimonButton
              handleClick={() => this.handleButtonClick("green")}
              compareSession={ () => this.compareUserClickToSession()}
              class={this.state.isGreenOn? "simonButton greenButtonOn" : "simonButton greenButton"}
              gameActive={this.state.gameActive}
              isUserTurn={this.state.isUserTurn}
            />
            <SimonButton
              handleClick={() => this.handleButtonClick("red")}
              compareSession={ () => this.compareUserClickToSession()}
              class={this.state.isRedOn? "simonButton redButtonOn" : "simonButton redButton"}
              gameActive={this.state.gameActive}
              isUserTurn={this.state.isUserTurn}
            />
          </div>
  
          <SimonMenu
            gameActive={this.state.gameActive}
            toggleGame={() => this.toggleGame()}
            startSession={() => this.startSession()}
            title={this.state.title}
            strictMode={this.state.strictMode}
            handleStrictMode={() => this.handleStrictMode()}
            levelsToWin={this.state.levelsToWin}
            levelUp={ () => this.levelUp()}
            levelDown= { () => this.levelDown()}
          />
  
          <div className="buttonRow">
            <SimonButton
              handleClick={() => this.handleButtonClick("yellow")}
              compareSession={ () => this.compareUserClickToSession()}
              class={this.state.isYellowOn? "simonButton yellowButtonOn" : "simonButton yellowButton"}
              gameActive={this.state.gameActive}
              isUserTurn={this.state.isUserTurn}
            />
            <SimonButton
              handleClick={() => this.handleButtonClick("blue")}
              compareSession={ () => this.compareUserClickToSession()}
              class={this.state.isBlueOn? "simonButton blueButtonOn" : "simonButton blueButton"}
              gameActive={this.state.gameActive}
              isUserTurn={this.state.isUserTurn}
            />
          </div>
        </div>
      </div>
    )
  }
}

// ================= Functions ==================//
//picks up a random number from 0 - 3, for choosing a random Simon button for the session
const doRandomColor = () => {
  let color = Math.floor (Math.random () * 4) + 1;
  switch (color) {
    case 1 :
      return "green";
    case 2:
      return "red";
    case 3:
      return "yellow";
    case 4:
      return "blue";
  }
};

// ================== Render ===================//
ReactDOM.render(<Simon className="simon" />, document.getElementById('root'))

