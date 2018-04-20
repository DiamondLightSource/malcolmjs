Architecture Background
=======================

Architectural Constraints
#########################

The following constraints have been placed on the system

+---------------------------------+---------------------------------------------------------------------------+
| Constraint                      | Architectural impacts                                                     |
+=================================+===========================================================================+
| The system must only use open   | The technologies chosen should be open source and suitable for deployment |
| source technologies             | in a Linux production environment to ensure that there are not any        |
|                                 | ongoing licensing costs.                                                  |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| The system must communicate     | The PANDA boxes that MalcolmJS will communicate with are set up with a    |
| with Malcolm using websockets   | socket server. This is because it can take time to perform an action on   |
|                                 | the equipment as well as being able to subscribe to a stream of updates   |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| The development will be done    | Manual testing effort is limited so we should make as much use of         |
| using Scrum                     | automated tests as possible                                               |
|                                 |                                                                           |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| The system needs to be fully    | MalcolmJS will be deployed alongside malcolm and served from the PANDA    |
| contained and not rely on any   | box, this may mean the client has no internet connection (e.g. if a       |
| internet connection             | laptop is plugged in directly to the equipment), therefore all            |
|                                 | dependencies (e.g. fonts) need to be part of the deployment package.      |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+


System Qualities
#########################

+---------------------------------+---------------------------------------------------------------------------+
| Quality                         | Note                                                                      |
+=================================+===========================================================================+
| Scalability                     | There is no scalability requirements in the normal sense as the system    |
|                                 | will be deployed from a single PANDA box and have very few clients        |
|                                 | attaching to it. Where it does need to be scalable is in the number of    |
|                                 | socket messages it can track, there may be a lot of attributes that are   |
|                                 | being watched and thus lots of Redux state updates, we need to ensure the |
|                                 | the site refreshes reasonably and remains usable.                         |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| Security                        | MalcolmJS currently has not security constraints as the site will be      |
|                                 | deployed from a PANDA box inside the Diamond network. Even when externally|
|                                 | hosted, all of the information comes from the websocket connection in     |
|                                 | Malcolm (which is inside the Diamond network). There are no user access   |
|                                 | requirements as it is open to anyone inside Diamond.                      |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| Testability                     | Given MalcolmJS is a react site revolving around a component based        |
|                                 | approach with a clear separation between the state and the presentation,  |
|                                 | it is important to ensure that each is independently testable to ensure   |
|                                 | that developers can work independently.                                   |
|                                 |                                                                           |
|                                 | This is also important considered that the malcolm related code may be    |
|                                 | split out into a separate library at a later time.                        |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| Usability                       | Usability is very important for MalcolmJS because it is a user interface  |
|                                 | for Malcolm. The site should be intuitive to learn with indicators/hints  |
|                                 | to what operations are happening (e.g. waiting for a socket reply).       |
|                                 |                                                                           |
|                                 | One key quality here is that the user should not have to scroll around    |
|                                 | for a lot of data; one usage scenario is when an engineer is configuring  |
|                                 | equipment and has MalcolmJS running on their laptop, they need to see the |
|                                 | Malcolm output without switching between the equipment and the laptop.    |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+
| Maintainability                 | MalcolmJS will continue to be developed beyond this intial stage, possibly|
|                                 | by the open source community or Diamond partners. Given this, MalcolmJS   |
|                                 | should be developed against all of the appropriate coding standards and   |
|                                 | that ease of maintenance is considered during development.                |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+


Engineering Principles
#########################

+-----------------+----------------------------------------------+--------------------------------------------+
| Principle       | Rational                                     | Architectural impacts                      |
+=================+==============================================+============================================+
| Separation of   | The application should be developed with     | The system will use the                    |
| concerns        | clear boundaries between different areas     | architectural layering defined to separate |
|                 |                                              | the data model (Malcolm information) from  |
|                 |                                              | the presentation                           |
+-----------------+----------------------------------------------+--------------------------------------------+
| Use of          | The use of standard frameworks and libraries,| Where possible, third party                |
| frameworks and  | where appropriate, will enable efficient     | libraries and frameworks should be         |
| libraries       | development and ensure that industry best    | used to facilitate development.            |
|                 | practice is followed.                        | They should be carefully evaluated         |
|                 |                                              | prior to use to ensure that they           |
|                 |                                              | are under active development, have         |
|                 |                                              | clear documentation and a large            |
|                 |                                              | community.                                 |
|                 |                                              |                                            |
+-----------------+----------------------------------------------+--------------------------------------------+
| Error handling  | The system needs to ensure that unexpected   | Each component will use a                  |
|                 | errors do not stop the system working        | consistent approach to error               |
|                 | entirely, and should make the user aware of  | handling.                                  |
|                 | what has gone wrong and how to report it     |                                            |
|                 |                                              |                                            |
+-----------------+----------------------------------------------+--------------------------------------------+
| Logging         | All components should implement logging      | Logging should be considered as a          |
|                 | appropriate to the components function.      | first class concern for all                |
|                 |                                              | components since they will require         |
|                 |                                              | different strategies. For example,         |
|                 |                                              | it will be important to know how the       |
|                 |                                              | malcolm communications fail in case it     |
|                 |                                              | needs hardware support, whereas react      |
|                 |                                              | errors are less important.                 |
+-----------------+----------------------------------------------+--------------------------------------------+
| Automated       | The system will need to be regularly and     | MalcolmJS should be designed to be deployed|
| release         | and easily deployed to reduce maintenance    | as a single package with releases being    |
|                 |                                              | published to github automatically when     |
|                 |                                              | tagged.                                    |
+-----------------+----------------------------------------------+--------------------------------------------+

Architectural Styles
#########################

+---------------------------------+---------------------------------------------------------------------------+
| Style                           | Description                                                               |
+=================================+===========================================================================+
| Modular architecture            | So that the Malcolm related logic can be kept in one place we should      |
|                                 | adopt a modular design for the data related operations as well as the     |
|                                 | presentational components so we can later choose to release the widgets   |
|                                 | as a component library for others to make Malcolm dashboards.             |
+---------------------------------+---------------------------------------------------------------------------+
| One way data flow               | As in now standard in React sites we will use a one way data flow         |
|                                 | paradigm to help separation of concerns, testability and performance      |
|                                 |                                                                           |
+---------------------------------+---------------------------------------------------------------------------+