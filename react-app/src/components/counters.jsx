import React, { Component } from "react";
import Counter from "./counter";
class Counters extends Component {
  state = {
    counters: [
      { id: 1, value: 4 },
      { id: 2, value: 0 },
      { id: 3, value: 0 },
      { id: 4, value: 0 },
    ],
  };
  handleDelete = (counterId) => {
    console.log("Handler called", counterId);
  };

  render() {
    return (
      <div className="row">
        {this.state.counters.map((counter) => (
          <Counter
            key={counter.id}
            className="col-12"
            onDelete={this.handleDelete} //counters is the parent of counter, so it handles the event raised, now the event is the delete function
            //so if you go back in the counter component, you'll se that on the delete button we are calling the props object on it, accessing the atrributes set on the parent component
            //wich are onDelete,value and key, but now we are calling only the onDelete event.
            //so the child component "raises" the event , and the parent "handles" it, using a function obv ,and in this case we called it handleDelete
            data={counter}
          />
        ))}
      </div>
    );
  }
}

export default Counters;
