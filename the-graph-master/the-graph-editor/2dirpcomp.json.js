loadGraph(
{
  "processes": {
    "Arm": {
      "component": "Gate1",
      "metadata": {
        "x": 360,
        "y": 480
      }
      
    },
    "SampleX": {
      "component": "Encoder1",
      "metadata": {
        "x": 540,
        "y": 480
      }
    },
    "FwdLineGate": {
      "component": "PComp1",
      "metadata": {
        "x": 720,
        "y": 420
      }
    },
    "BwdLineGate": {
      "component": "PComp2",
      "metadata": {
        "x": 360,
        "y": 360
      }
    },
    "TGen": {
      "component": "TGen",
      "metadata": {
        "x": 720,
        "y": 240
      }
    },
    "OrLineGate": {
      "component": "LUT1",
      "metadata": {
        "x": 900,
        "y": 360
      }
    },
    "LinePulse": {
      "component": "PComp3",
      "metadata": {
        "x": 540,
        "y": 60
      }
    },
    "DetDly": {
      "component": "Pulse1",
      "metadata": {
        "x": 540,
        "y": 180
      }
    },
    "CapDly": {
      "component": "Pulse2",
      "metadata": {
        "x": 540,
        "y": 300
      }
    },
    "Det": {
      "component": "TTLOut1",
      "metadata": {
        "x": 540,
        "y": 300
      }
    },
    "PosCap": {
      "component": "PCap",
      "metadata": {
        "x": 540,
        "y": 300
      }
    },
    "OrLineDone": {
      "component": "LUT2",
      "metadata": {
        "x": 360,
        "y": 120
      }
    }
  },
  "connections": [
    {
      "src": {
        "process": "Arm",
        "port": "Out"
      },
      "tgt": {
        "process": "FwdLineGate",
        "port": "Ena"
      }
    },
    {
      "src": {
        "process": "Arm",
        "port": "Out"
      },
      "tgt": {
        "process": "BwdLineGate",
        "port": "Ena"
      }
    },
    {
      "src": {
        "process": "SampleX",
        "port": "Posn"
      },
      "tgt": {
        "process": "FwdLineGate",
        "port": "Posn"
      },
      "metadata": {
        "route": 9
      }
    },
    {
      "src": {
        "process": "SampleX",
        "port": "Posn"
      },
      "tgt": {
        "process": "BwdLineGate",
        "port": "Posn"
      },
      "metadata": {
        "route": 9
      }
    },
    {
      "src": {
        "process": "FwdLineGate",
        "port": "Act"
      },
      "tgt": {
        "process": "OrLineDone",
        "port": "Inp1"
      }
    },
    {
      "src": {
        "process": "BwdLineGate",
        "port": "Act"
      },
      "tgt": {
        "process": "OrLineDone",
        "port": "Inp2"
      }
    },
    {
      "src": {
        "process": "FwdLineGate",
        "port": "Out"
      },
      "tgt": {
        "process": "OrLineGate",
        "port": "Inp1"
      }
    },
    {
      "src": {
        "process": "BwdLineGate",
        "port": "Out"
      },
      "tgt": {
        "process": "OrLineGate",
        "port": "Inp2"
      }
    },
    {
      "src": {
        "process": "OrLineGate",
        "port": "Out"
      },
      "tgt": {
        "process": "LinePulse",
        "port": "Ena"
      }
    },
    {
      "src": {
        "process": "TGen",
        "port": "Time"
      },
      "tgt": {
        "process": "LinePulse",
        "port": "Posn"
      },
      "metadata": {
        "route": 9
      }
    },
    {
      "src": {
        "process": "LinePulse",
        "port": "Out"
      },
      "tgt": {
        "process": "DetDly",
        "port": "Inp"
      }
    },    
    {
      "src": {
        "process": "LinePulse",
        "port": "Out"
      },
      "tgt": {
        "process": "CapDly",
        "port": "Inp"
      }
    },  
    {
      "src": {
        "process": "DetDly",
        "port": "Out"
      },
      "tgt": {
        "process": "Det",
        "port": "Inp"
      }
    },     
    {
      "src": {
        "process": "LinePulse",
        "port": "Out"
      },
      "tgt": {
        "process": "DetDly",
        "port": "Inp"
      }
    },      
    {
      "src": {
        "process": "CapDly",
        "port": "Out"
      },
      "tgt": {
        "process": "PosCap",
        "port": "Trig"
      }
    },
    {
      "src": {
        "process": "Arm",
        "port": "Out"
      },
      "tgt": {
        "process": "PosCap",
        "port": "Ena"
      }
    },    
    {
      "src": {
        "process": "OrLineDone",
        "port": "Out"
      },
      "tgt": {
        "process": "Arm",
        "port": "Rst"
      }
    }       
  ]
}
);
