/**
 * Created by twi18192 on 19/11/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var draggedElement = null;

var nodeSelectedStates = {
    Gate1: false,
    TGen1: false
};

function selectNode(Node){
    nodeSelectedStates[Node] = true;
}

function deselectAllNodes(){
    for(var node in nodeSelectedStates){
        nodeSelectedStates[node] = false
    }
    console.log(nodeSelectedStates);
}

var allNodeInfo = {

    Gate1: {
        inports: {
            "set": {connected: false, connectedTo: null}, /* connectedTo should probably be an array, since outports can be connected to multiple inports on different nodes */
            "reset": {connected: false, connectedTo: null}
        },
        outports: {
            "out": {connected: false, connectedTo: null}
        }
    },

    TGen1: {
        inports: {
            "ena": {connected: false, connectedTo: null}
        },
        outports: {
            "posn": {connected: false, connectedTo: null}
        }
    }
};

var nodePositions = {
    Gate1: {
        x: 400,
        y: 100
    },

    TGen1: {
        x: 600,
        y: 10
    },
    PComp1: {
        x: 800,
        y: 200
    }
};

var portPositionsForNodes = {
    portRadius: 2,
    inportPositionRatio: 0,
    outportPositionRatio: 1,
    GateNodePortStyling: {
        inportPositions: {
            set: {
                x: 3,
                y: 25
            },
            reset: {
                x: 3,
                y: 40
            }
        },
        outportPositions: {
            out: {
                x: 65 + 3,
                y: 33
            }
        }
    },
    TGenNodePortStyling: {
        inportPositions: {
            ena: {
                x: 3,
                y: 33
            }
        },
        outportPositions: {
            posn: {
                x: 65 + 3,
                y: 33
            }
        }
    }
};

var gateNodeInports = portPositionsForNodes.GateNodePortStyling.inportPositions;
var gateNodeOutports = portPositionsForNodes.GateNodePortStyling.outportPositions;
var tgenNodeInports = portPositionsForNodes.TGenNodePortStyling.inportPositions;
var tgenNodeOutports = portPositionsForNodes.TGenNodePortStyling.outportPositions;

function updateGate1Position(newCoordinates){
    /* Will be used to update the coordinates of a node when dragged, to then find the new location of the ports a connected edge needs to stick to */
    nodePositions.Gate1 = {
        x: nodePositions.Gate1.x + newCoordinates.x,
        y: nodePositions.Gate1.y + newCoordinates.y
    };
    /* Also need to update the port positions somehow! */
}

function updateNodePosition(NodeInfo){
    if(typeof allPossibleNodes[draggedElement] !== 'function'){
        throw new Error('Invalid node id')
    }
     return allPossibleNodes[draggedElement](NodeInfo)
}

var allPossibleNodes = {

    'Gate1': function(NodeInfo){
        nodePositions.Gate1 = {
            x: nodePositions.Gate1.x + NodeInfo.x,
            y: nodePositions.Gate1.y + NodeInfo.y
        };
    },
    'TGen1': function(NodeInfo){
        nodePositions.TGen1 = {
            x: nodePositions.TGen1.x + NodeInfo.x,
            y: nodePositions.TGen1.y + NodeInfo.y
        }
    },
    'PComp1': function(NodeInfo){
        nodePositions.PComp1 = {
            x: nodePositions.PComp1.x + NodeInfo.x,
            y: nodePositions.PComp1.y + NodeInfo.y
        }
    }
};

var nodeStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function(cb){
        this.on(CHANGE_EVENT, cb)
    },
    removeChangeListener: function(cb){
        this.removeListener(CHANGE_EVENT, cb)
    },
    emitChange: function(){
        this.emit(CHANGE_EVENT)
    },
    getGate1InportsState: function(){
        return allNodeInfo.Gate1.inports
    },
    getGate1OutportsState: function(){
        return allNodeInfo.Gate1.outports
    },
    getTGen1InportsState: function(){
        return allNodeInfo.TGen1.inports
    },
    getTGen1OutportsState: function(){
        return allNodeInfo.TGen1.outports
    },


    getGate1Position: function(){
        return nodePositions.Gate1;
    },
    getTGen1Position: function(){
        return nodePositions.TGen1;
    },
    getPComp1Position: function(){
        return nodePositions.PComp1;
    },

    /* For edge use */
    //getGateNodeOutPort: function(){
    //    return portPositionsForEdges.gateNode.outports.out;
    //},
    //getTGenNodeEnaPort: function(){
    //    return portPositionsForEdges.tgenNode.inports.ena;
    //},
    getGateNodeOutportOut: function(){
        return gateNodeOutports.out;
    },
    getTGenNodeInportEna: function(){
        return tgenNodeInports.ena;
    },

    getGate1SelectedState: function(){
        return nodeSelectedStates.Gate1;
    },
    getTGen1SelectedState: function(){
        return nodeSelectedStates.TGen1;
    }
});

AppDispatcher.register(function(payload){
    var action = payload.action;
    var item = action.item;

    switch(action.actionType){

        case appConstants.GATENODE_CHANGEPOSITION:
            console.log(payload);
            console.log(action);
            updateGate1Position(item);
            nodeStore.emitChange();
            break;

        case appConstants.DRAGGED_ELEMENT:
            console.log(payload);
            console.log(action);
            draggedElement = item;
            console.log(draggedElement);
            break;

        case appConstants.CHANGE_NODEPOSITION:
            //console.log(payload);
            //console.log(item);
            updateNodePosition(item);
            nodeStore.emitChange();
            break;

        case appConstants.SELECT_NODE:
            console.log(payload);
            console.log(item);
            selectNode(item);
            console.log(nodeSelectedStates);
            nodeStore.emitChange();
            break;

        case appConstants.DESELECT_ALLNODES:
            console.log(payload);
            console.log(item);
            deselectAllNodes();
            console.log(nodeSelectedStates.Gate1);
            console.log(nodeSelectedStates.TGen1);
            nodeStore.emitChange();
            break;


        default:
            return true
    }

});

module.exports = nodeStore;


/* Port calculation to render the edges properly has been moved to the render function of an edge;
 this is to allow constant rerendering due to node position changes
 */

//var portPositionsForEdges = {
//    gateNode: {
//        inports: {
//            set: {
//                x: nodePositions.gateNode.x + gateNodeInports.set.x,
//                y: nodePositions.gateNode.y + gateNodeInports.set.y
//            },
//            reset: {
//                x: nodePositions.gateNode.x + gateNodeInports.reset.x,
//                y: nodePositions.gateNode.y + gateNodeInports.reset.y
//            }
//        },
//        outports: {
//            out: {
//                x: nodePositions.gateNode.x + gateNodeOutports.out.x,
//                y: nodePositions.gateNode.y + gateNodeOutports.out.y
//            }
//        }
//    },
//    tgenNode: {
//        inports: {
//            ena: {
//                x: nodePositions.tgenNode.x + tgenNodeInports.ena.x,
//                y: nodePositions.tgenNode.y + tgenNodeInports.ena.y
//            }
//        },
//        outports: {
//            posn: {
//                x: nodePositions.tgenNode.x + tgenNodeOutports.posn.x,
//                y: nodePositions.tgenNode.y + tgenNodeOutports.posn.y
//            }
//        }
//    }
//
//};
