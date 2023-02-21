import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Deck{
  constructor(){
      this.table_cards = [];

      this.player_cards = [];
      this.dealer_cards = [];

      this.player_score = 0;
      this.dealer_score = 0;

      this.turn = -1;

      this.next_table_card = this.next_table_card.bind(this);
      this.reset_game = this.reset_game.bind(this);
      this.get_card_suit = this.get_card_suit.bind(this);
      this.card_points = this.card_points.bind(this);
      this.card_data = this.card_data.bind(this);
  }

  next_table_card(){
      var new_card = 0;
      while (new_card == 0 || this.table_cards.includes(new_card)){
          new_card = Math.round(Math.random() * 52)
      };
      this.table_cards.push(new_card);
      return new_card;
  }

  reset_game(){
    this.table_cards = [];

    this.player_cards = [];
    this.dealer_cards = [];

    this.player_score = 0;
    this.dealer_score = 0;

    this.turn = -1;
  }

  get_card_suit(x){
      if (0 < x && x < 14) {
          return [x, 'clubs', 0];
      } else if (13 < x && x < 27) {
          return [x, 'diamonds', 13];
      } else if (26 < x && x < 40) {
          return [x, 'hearts', 26];
      } else if (39 < x && x < 53) {
          return [x, 'spades', 39];
      }
  }

  card_points(x){
      var card_ = this.get_card_suit(x);
      card_.push((x - card_[2]));
      if ((x - card_[2]) == 1) {
          card_.push(11);
      } else if (1 < (x - card_[2]) && (x - card_[2]) < 11) {
          card_.push((x - card_[2]));
      } else if (10 < (x - card_[2]) && (x - card_[2]) < 14) {
          card_.push(10);
      }
      return [card_[1], card_[3], card_[4]];
  }


  card_data(){
    //indexes / 0 suit / 1 suit number / 2 value /
    var card_data = this.card_points(this.next_table_card());
    var card_class_name = '';

    if (card_data.includes('clubs')) {
        card_class_name = card_data[1] + '_of_' + card_data[0];
    } else if (card_data.includes('diamonds')) {
        card_class_name = card_data[1] + '_of_' + card_data[0];
    } else if (card_data.includes('hearts')) {
        card_class_name = card_data[1] + '_of_' + card_data[0];
    } else if (card_data.includes('spades')) {
        card_class_name = card_data[1] + '_of_' + card_data[0];
    }

    if (this.turn > 0){
      this.player_cards.push(card_class_name);
      this.player_score += card_data[2];
    } else if (this.turn < 0) {
      this.dealer_cards.push(card_class_name);
      this.dealer_score += card_data[2];
    }

    this.turn *= -1;
    return;
  }
}

//////////////////////////////////////////////
class Card extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
        <img className='col' key={this.props.card_name} src={'./card-icons/'+this.props.card_name+'.png'}></img>
    );
  }
}

class Cards extends React.Component {
  constructor(props){ //not a useless constructor
    super(props);
  }

  render(){
    return(
      <section className="row container-fluid">
        {this.props.card_array.map(card_name => <Card card_name={card_name} />)}
      </section>
    );
  }
}


//////////////////////////////////////////////

var deck = new Deck();

class Board extends React.Component {
  constructor(){
    super();
    this.state = {
      player_cards: [],
      dealer_cards: [],
      player_score: 0,
      dealer_score: 0,
      stand_up: false,
    }

    this.set_state = this.set_state.bind(this);
    this.empty_state = this.empty_state.bind(this);
    this.set_stand_up = this.set_stand_up.bind(this);
  }

  set_state(){
    deck.card_data();

    this.setState({
      player_cards: deck.player_cards,
      dealer_cards: deck.dealer_cards,

      player_score: deck.player_score,
      dealer_score: deck.dealer_score,
    });
  }

  set_stand_up(){
    this.setState({stand_up: true})
  }

  empty_state(){
    deck.reset_game();

    this.setState({
      player_cards: [],
      dealer_cards: [],

      player_score: 0,
      dealer_score: 0,
      stand_up: false,
    });
  }

  render(){

    if ((this.state.stand_up) || (this.state.player_cards.length > 5)){
      return(
        <main className="container-fluid">
        <Cards card_array={this.state.dealer_cards}/>
        <br></br>
        <div className='score border-dark rounded'>
          <div className='border border-dark rounded align-center'>Score: {this.state.dealer_score}</div>
          <button className="btn btn-dark ronda" onClick={this.empty_state}>NUEVA RONDA</button>
        </div>

        <br></br>

        <Cards card_array={this.state.player_cards}/>
        <br></br>
        <div className='score border-dark rounded'>
          <div className='border border-dark rounded'>Score: {this.state.player_score}</div>
          <button className="btn btn-dark ronda" onClick={this.empty_state}>NUEVA RONDA</button>
        </div>
      </main>
      );
    }

    if (deck.turn > 0){
      return(
        <main className="container-fluid">
          <Cards card_array={this.state.dealer_cards}/>
          <br></br>
          <div className='score border-dark rounded'>
            <div className='border border-dark rounded'>Score: {this.state.dealer_score}</div>
            <button className="btn btn-dark" disabled>Añadir</button>
            <button className="btn btn-dark" disabled>Plantarse</button>
          </div>
  
          <br></br>
  
          <Cards card_array={this.state.player_cards}/>
          <br></br>
          <div className='score border-dark rounded'>
            <div className='border border-dark rounded'>Score: {this.state.player_score}</div>
            <button className="btn btn-dark" onClick={this.set_state}>Añadir</button>
            <button className="btn btn-dark" onClick={this.set_stand_up}>Plantarse</button>
          </div>
        </main>
      );

    } else if (deck.turn  < 0) {
      return(
        <main className="container-fluid">
          <Cards card_array={this.state.dealer_cards}/>
          <br></br>
          <div className='score border-dark rounded'>
            <div className='border border-dark rounded'>Score: {this.state.dealer_score}</div>
            <button className="btn btn-dark" onClick={this.set_state}>Añadir</button>
            <button className="btn btn-dark" onClick={this.set_stand_up}>Plantarse</button>
          </div>
  
          <br></br>
  
          <Cards card_array={this.state.player_cards}/>
          <br></br>
          <div className='score border-dark rounded'>
            <div className='border border-dark rounded'>Score: {this.state.player_score}</div>
            <button className="btn btn-dark" disabled>Añadir</button>
            <button className="btn btn-dark" disabled>Plantarse</button>
          </div>
        </main>
      );
    }
  }
}
  
  // ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Board />);
  
   