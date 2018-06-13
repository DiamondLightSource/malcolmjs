Architectural Decision Record
=============================

**1. Malcolm protocol related code should be grouped together**

------------

**Status:** Active

**Context:** Other groups may wish to generate their own dashboards from Malcolm outputs and so we may want to release the Malcolm related code as an ``npm`` package

**Decision:** Any communication with Malcolm via the socket should be isolated from the rest of the application, and code related to that should be stored together.

**Consequences:** A single redux reducer should be used for processing Malcolm results and adding it to the Redux store, presentational components should make use of that information from the store. Malcolm related actions should be built with action creators that are stored with the Malcolm code and components should import those action creators rather than building actions themselves.


|

**2. Attribute components should be grouped together**

------------

**Status:** Active

**Context:** Other groups may wish to use the MalcolmJS widgets in their dashboards and so we may want to release the attribute components as an ``npm`` package (probably part of the same package as the Malcolm related code).

**Decision:** Attribute compoenents should be grouped together in the codebase and not rely on other parts of the code.

**Consequences:** Attribute components should be as stateless as possible (see below).

|

**3. Attribute components should be as stateless as possible**

------------

**Status:** Active

**Context:** Other groups may wish to use the MalcolmJS widgets in their dashboards and so we may want to release the attribute components as an ``npm`` package (probably part of the same package as the Malcolm related code).

**Decision:** Attribute components should be isolated from the rest of the code base and all interactions should be done by passing in props and actions.

**Consequences:** Attribute compoenents should be developed with Storybook to ensure they are properly decoupled from the rest of the application.

|
