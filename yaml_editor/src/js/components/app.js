import React from 'react';
import ReactDOM from 'react-dom';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/yaml/yaml.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/yaml-hint.js';

import lookupTable from '../../lookup_table_data.json';

var yamltext = `typeid: scanpointgenerator:generator/CompoundGenerator:1.0
`

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
            hintOptions: {schemaInfo: lookupTable},
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
