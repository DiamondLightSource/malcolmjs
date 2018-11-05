# Improve performance

## Demo
1. Describe how performance was a real problem as the whole UI ground to a halt with 40Hz updates
1. Describe how we've now shifted the web socket connection into a web worker
1. Show the web site running with 40Hz updates
1. Show the results of the performance analysis. Talk about how we had a good gain by making sure we do a JSON.stringify before passing back to the other thread.

## Part 2
1. Talk about how we're working on grouping the updates together
1. Talk about how we're also working on limiting how fast the LED updates and notifies you of it being throttled.
