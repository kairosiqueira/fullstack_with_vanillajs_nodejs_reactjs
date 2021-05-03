import React, { Component } from 'react'

export default class UserInput extends Component {
    handleInputChange = (event) => {
        const newText = event.target.value;
        this.props.onChangeText(newText);
    }
    render() {
        const { userInput } = this.props;
        return (
            <div>
                <form className="col s12">
                    <p>Type a text here:</p>
                    <input placeholder="Learning React" 
                        value={userInput} 
                        onChange={this.handleInputChange}
                        className="input"
                        type="text" />
                </form>
            </div>
        )
    }
}
