import React, { Component } from 'react'

export default class TransformedInputs extends Component {
    render() {

        const { 
            reversedText, 
            numericText, 
            csvText, 
            slugText, 
            onlyVowelsText, 
            onlyConsonantsText, 
            toVarText } = this.props;

        return (
            <div>
                <fieldset className="fieldset center">
                    <legend>Transformations</legend>
                        <div className="input-field col s12">
                            <p>Inverted text:</p>
                            <input placeholder="Inverted text" type="text" readOnly value={reversedText} />
                        </div>
                        <div className="input-field col s12">
                            <p>Numeric text:</p>
                            <input placeholder="Numeric text" type="text" readOnly value={numericText} />
                        </div>     
                        <div className="input-field col s12">
                            <p>CSV:</p>
                            <input placeholder="CSV" type="text" readOnly value={csvText} />
                        </div>  
                        <div className="input-field col s12">
                            <p>Slug:</p>
                            <input placeholder="Slug" type="text" readOnly value={slugText} />
                        </div>     
                        <div className="input-field col s12">
                            <p>Only vowels:</p>
                            <input placeholder="Only vowels" type="text" readOnly value={onlyVowelsText} />
                        </div>  
                        <div className="input-field col s12">
                            <p>Only Consonants:</p>
                            <input placeholder="Only consonants" type="text" readOnly value={onlyConsonantsText} />
                        </div>  
                        <div className="input-field col s12">
                            <p>Variable value:</p>
                            <input placeholder="Variable" type="text" readOnly value={toVarText} />
                        </div>                                                                                          
                </fieldset>
            </div>
        )
    }
}