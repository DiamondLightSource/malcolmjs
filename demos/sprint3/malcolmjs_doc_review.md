# Documentation Review Notes
### Introduction
  > OK

----

## User Guide
### Introduction
  >empty page

---
## Systems Maintenance Guide
### Architeture
- Context
- Containers
- Components
- Deployment View
- Technologies
- Quality
  >In the 'Security' section
  > it states:
  < There are no current security restrictions on MalcolmJS as it has to be able to communicate with a Malcolm enabled devide...
  There's s typo 'divide' sjould read 'device'.
>

### Architecture Background
- Architectural Constraints
- System Qualities
  > Security:  
  *Reads*:  
  "MalcolmJS currently has __not__ security constraints..."  
  *should be*:   
  "MalcolmJS currently has __no__ security sonstraints..."
- Engineering Pronciples
- Architectural styles

### Architectural Decision Record
> - 1 typo: "protoc__a__l" should read "protoc__o__l"

### Sequence Diagrams
> presently empty

### Setting up a Development Environment
> `npm install` works  
> `npm run storybook` and `npm run e2e` do not.

### Documentation Development
### Setting up a virtual environment
>Totally agree with the direction this is giving, but I wonder whether it should be a bit more prescriptive, as running pip <anything> requires having write access to the python installation. Should there be at least a caveat that the developer has already installed and switched to a local Python installation?<

Then make a new virtual environment:

`mkvirtualenv malcolmjs-docs`

This doesn't work without some additional stages. It would be necessary to search online
for mkvirtualenv and which package to install to provide it.

### Maintenance
Useful URLs

Coverage: "No commits found on master yet."

Otherwise - good

### NPM Commands
| Command  | Test result |
| ------------- | ------------- |
| npm start  | OK  |
| npm test  | OK  |
| npm e2e  | Doesn't know what e2e is  |
| npm e2e:interactive  | Doesn't know what e2e is  |
| npm storybook  | Doesn't know what storybook is  |

### The malcolm development server
Couldn't get server command to be recognised. Maybe something mussed in my dev setup??

## Deployment
This is a very neat way to do releases via Travis.
