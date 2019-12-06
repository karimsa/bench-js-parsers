# bench-js-parsers

Some benchmarks to show the performance of various JS parsers.

Specifically, I wanted to compare two features:

 * Being able to generate an AST (as a baseline test)
 * Being able to traverse the given AST recursively to perform basic static analysis

The benchmark code does not enable any helper features for the traversal in any of the
parsers such as scope computation or ancestor gathering. It assumes that these are either
not needed or can be implemented in the userland code.

## Benchmarks

These are the benchmark results on my machine, which is a MacBook Air Early 2015 with a 2.2 GHz Intel i7.
The purpose is not to take the specific numbers seriously but rather to compare the different parsers at
orders of magnitude (assuming that two parsers with results that are within the same order of magnitude
are relatively equally performant).

*Note: newlines have been added in the output to make it easier to read.*

```

> @ benchmark /Users/karimsa/projects/bench-js-parsers
> wiz bench "--benchTime" "5000000"

Targets:
  - bootstrap.min.js:
        Hash: 61f338f870fcd0ff46362ef109d28533
        Size: 60010 bytes
  - jquery.min.js:
        Hash: 220afd743d9e9643852e31a135a9f3ae
        Size: 88145 bytes
  - react.development.js:
        Hash: 5096de8b459ac09462a481b55b4af8c0
        Size: 74430 bytes
  - app.jsx (todomvc):
        Hash: eb7765b55e8ffdab46d93e183c381227
        Size: 3940 bytes

        parse: app.jsx (todomvc) - @babel/parser        762 ops/s     6.2 ms/op 
        parse: app.jsx (todomvc) - acorn              1 609 ops/s     5.8 ms/op 
        parse: app.jsx (todomvc) - esprima            1 980 ops/s     4.4 ms/op 
        parse: app.jsx (todomvc) - meriyah            4 574 ops/s     3.3 ms/op 

        parse: bootstrap.min.js - @babel/parser          41 ops/s    32.9 ms/op 
        parse: bootstrap.min.js - acorn                  75 ops/s    26.9 ms/op 
        parse: bootstrap.min.js - esprima                50 ops/s    32.7 ms/op 
        parse: bootstrap.min.js - meriyah               261 ops/s    11.1 ms/op 

        parse: jquery.min.js - @babel/parser             22 ops/s      48 ms/op 
        parse: jquery.min.js - acorn                     40 ops/s    31.4 ms/op 
        parse: jquery.min.js - esprima                   29 ops/s      38 ms/op 
        parse: jquery.min.js - meriyah                  133 ops/s    16.5 ms/op 

        parse: react.development.js - @babel/parser      88 ops/s    26.6 ms/op 
        parse: react.development.js - acorn             204 ops/s     5.6 ms/op 
        parse: react.development.js - esprima           134 ops/s     7.9 ms/op 
        parse: react.development.js - meriyah           407 ops/s     2.9 ms/op 

        walk: app.jsx (todomvc) - @babel/parser         187 ops/s    10.1 ms/op 
        walk: app.jsx (todomvc) - acorn               1 276 ops/s     3.5 ms/op 
        walk: app.jsx (todomvc) - esprima               927 ops/s     2.4 ms/op 
        walk: app.jsx (todomvc) - meriyah             2 914 ops/s     1.1 ms/op 

        walk: bootstrap.min.js - @babel/parser            9 ops/s   103.7 ms/op 
        walk: bootstrap.min.js - acorn                   53 ops/s    42.5 ms/op 
        walk: bootstrap.min.js - esprima                 63 ops/s      16 ms/op 
        walk: bootstrap.min.js - meriyah                145 ops/s     7.3 ms/op 

        walk: jquery.min.js - @babel/parser               5 ops/s   195.2 ms/op 
        walk: jquery.min.js - acorn                      27 ops/s    61.2 ms/op 
        walk: jquery.min.js - esprima                    24 ops/s    54.5 ms/op 
        walk: jquery.min.js - meriyah                    86 ops/s    11.6 ms/op 

        walk: react.development.js - @babel/parser       26 ops/s    38.4 ms/op 
        walk: react.development.js - acorn              113 ops/s    31.5 ms/op 
        walk: react.development.js - esprima            149 ops/s     6.8 ms/op 
        walk: react.development.js - meriyah            296 ops/s     3.4 ms/op 

bench: 12m
```

## License

Licensed under MIT license.
