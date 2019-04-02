import React from 'react';
import ReactDOM from 'react-dom';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/yaml-hint.js';

var yamltext = `# Define the generic Producer, this can be overridden with a
# site specific .local.yaml file
type: pvi.producers.AsynProducer
overridden_by: $(yamlname).local.yaml
# Define the arguments that the template takes
takes:
  - type: builtin.takes.string
    name: P
    description: Record prefix part 1
    default: ""
    
  - type: builtin.takes.string
    name: R

  - type: builtin.takes.int
    name: THING
    default: 41

  - type: builtin.takes.string
    name: PORT
    description: Asyn port name

`;

var dummyValidatedObject = {

    valueType: "ObjectArrayMeta",
    type: {

        "pvi.producers.AsynProducer": {

            valueType: "ObjectMeta",
            attributes: {    
                overridden_by: {
                    valueType: "StringMeta"
                },

                takes: {
                    valueType: "ObjectArrayMeta",
                    type: {
                        'builtin.takes.string': {
                            valueType: "ObjectMeta",
                            attributes: {
                                name: {
                                    valueType: "StringMeta"
                                },

                                description: {
                                    valueType: "StringMeta"
                                },

                                default: {
                                    valueType: "StringMeta"
                                }
                            }

                        },

                        'builtin.takes.int': {
                            valueType: "ObjectMeta",
                            attributes: {
                                name: {
                                    valueType: "StringMeta"
                                },

                                description: {
                                    valueType: "StringMeta"
                                },

                                default: {
                                    valueType: "IntMeta"
                                }
                            }

                        },
                    }
                },


                pv_prefix: {
                    valueType: "StringMeta"
                },

                asyn_port: {
                    valueType: "StringMeta"
                },

                template_output: {
                    valueType: "StringMeta"
                },

                opi_output: {
                    valueType: "StringMeta"
                },

                adl_output: {
                    valueType: "StringMeta"
                }
            }
        }            
    }
};

class App extends React.Component {

    constructor(props){
        super(props);
        this.instance = null;
        this.state = {
            value: yamltext
        }
    }

    render(){

        var options = {
            mode: "yaml",
            lineNumbers: true,
            theme: "oceanic-next",
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Tab": () => {this.instance.execCommand("insertSoftTab")}
            },
            hintOptions: {schemaInfo: dummyValidatedObject},
            tabSize: 2
        }

        return(
            <CodeMirror
                editorDidMount={(editor) => {this.instance = editor}}
                value={this.state.value}
                options={options}
                onBeforeChange={(editor, data, value) => {
                    this.setState({value});
                }}
                onChange={(editor, data, value) => {}}
            />
        );
    }

}


ReactDOM.render(<App/>, document.getElementById('root'));
