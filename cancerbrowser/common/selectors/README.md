# Selectors

Selectors are constructs used by [reselect](https://github.com/reactjs/reselect) for optimizing performance around derived data when using [Redux](http://redux.js.org/). The basic idea is that you store the raw data in your Redux store and when you need derived forms in your containers, you use a selector to create them.

The benefit of the selector is that it does a simple memoization technique based on a set of **input selectors**, which are typically getters into the Redux store, but can also be selectors themselves. Reselect checks to see if the output from the input selectors is the same as the previous call to the selector, in which case it returns the previously computed result. This saves the re-computation of derived data for every render when that data itself doesn't change. In the event that the results from the input selectors do change, the previously memoized result is thrown away and the new result is cached. Reselect does not maintain a history of cached results, only the previous one used.