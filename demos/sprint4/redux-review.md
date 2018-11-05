# Redux review

## Stories covered
1. 152 - Redux review

## Demo
We had a 2hr meeting to discuss the current structure of the store, there were several actions that came out of it:

1. MessagesInFlight should be a dictionary not an array
1. Use the metadata (e.g. widget tag) to identify things rather than the label
1. Does the parentBlock need to be on the malcolm state or can it go on the view state?
1. Does snackbar need to be on malcolm state or can it go on the view state?
1. Ensure we don't key on `layout` but look for `widget:flowgraph`.
1. Update attributes so they have the structure `{id, data, calculated}`
1. Work out how to document the store in a maintainable way.