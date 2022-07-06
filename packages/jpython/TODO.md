# TODO List of little things that I want to change in JPython

## Not Done

[ ] dict setitem messed up

```
>>> w = dict()
{}
>>> w.set('x',10)
>>> w
{'x': 10}
>>> w['y'] = 15
15
>>> w
{'x': 10}
```

[ ] get rid of existential operator

[ ] Implement `await`, e.g., `await init()` in repl isn't supported at all.

[ ] put a file `a.js` in the current directory and do `require("./a.js")`; it doesn't work. You need to give the exact path. fix.

---

[ ] One of brython benchmarks -- for creating a trivial class -- is an order of magnitude too slow. This is because of NOT using ES6 classes. Changing
to that makes it **much** faster. This is very important for math. We're talking 100x speedup.

---

[ ] include context in parse errors, e.g., jpython versus python:

```bash
~/jsage/packages/jpython/test$ jpython lambda.py
lambda.py:Unexpected token: punc ']' (line: 39, col: 33, pos: 667)
~/jsage/packages/jpython/test$ python lambda.py
  File "/home/user/jsage/packages/jpython/test/lambda.py", line 39
    assert v[1] == {'world': 'there'}]
                                     ^
SyntaxError: unmatched ']'
```

---

[ ] make %time/time command also show cpu time (https://www.geeksforgeeks.org/node-js-process-cpuusage-method/), and similar for benchmark suite

---

[ ] implement `__call__` dunder method. Actually NO -- I tried this and it's **just too slow.** The JIT just isn't good enough to deal with this. In fact, this should help clarify our tradeoffs. Similar remark about dealing with `new`.

- [x] Did implement the easy special case of `identifier(foo...)`.
- Actually, if I change the classes that jpython produces to be ES6 classes (which I plan to do), then https://www.npmjs.com/package/callable-instance provides a nice efficient solution. Just generate a javascript class that is itself callable. It will also work from Javascript (not just jpython). It's efficient when in use, though surely making the callable object in the first place is slower, though for my application that is fine. Also [this approach](https://stackoverflow.com/questions/19335983/can-you-make-an-object-callable) for old non-ES6.

[ ] implement `__eq__`, `__ne__` dunder methods?

---

[ ] improve tab completion:

- filenames in the current directory
- seems pretty in some cases, e.g., in a function call
- maybe make it evaluate code up to some time limit?
- do NOT show private methods by default

---

[ ] exception types; almost none of them work or are even defined. TypeError is there, but RuntimeError isn't...

---

[ ] Use ES6 classes instead of functions and prototypes to model classes.

---

[ ] Actually add typings to the compiler implementation.
I added some...

---

[ ] Support for using mypy typing.

- [x] function declarations
- [ ] type hints for vars, e.g. `my_global_dict: dict[int, float] = {}`. Doesn't work now. Just need to make everything between identifier and = be discarded.

---

[ ] A Jsage / JPython Jupyter kernel.

---

[ ] instead of storing the `dev/*.js` and `release/*.js` autogenerated files -- that are needed to autogenerate themselves! -- in the github repo, make building depend on npm installing the last published version... which has those files. Put the built files in dist/. For bootstraping, have to get the files from the last version published.

[ ] Rewrite the tests to use builtin assert statement, rather than the Javascript assrt module, so can use pytest in some cases at least (i.e., to check that results are the same as with Python... unless otherwise noted!). Make sure every test in the test suite (except special jsage extensions) works equally well with Pure python via pytest. Also, is maybe rewrite a little of pytest to do our testing?

[ ] Bug in tuple unpacking:
In Jpython:

```py
>>> [a,[b,c]] = [1,[[17,23],3]]
23
>>> a
1
>>> b
17
>>> c
23
```

It should be as you can see in normal python:

```py
>>> [a,[b,c]] = [1,[[17,23],3]]
>>> a
1
>>> b
[17, 23]
>>> c
3
```

See `def expression(commas, no_in):` in `src/parse.py`

This broke bench/nbody.py pretty badly...

---

[ ] tuples aren't implemented at all...

---

[ ] source maps.

---

[ ] The REPL doesn't let you use any of the string modifiers are variables, sort of. In particular, for any letter in `vrufVRUF` (defined in `tokenizer.py`) in the repl we have:

```py
>>> f = 10
>>> f
[Object: null prototype] {}
>>> print(f)
10
```

---

[ ] eval. The eval function is **Javascript** eval, rather than running our Python compiler, then evaling that, which makes way more sense.

```py
>>> eval('for(i=0;i<10;i++){console.log(i)}')
0
1
...
```

---

## Done

[x] parenthesis line continuation (a nice newer feature of python), e.g. this:

```py
~/jsage/packages/jpython$ jpython
Welcome to JPython.  Using Node.js v16.7.0.
>>> # this shouldn't be broken
>>> a = (1,
... 2)
...
1:6:Unexpected token: found type='punc', value=',';  expected: 'punc', possible value=')'
>>> # this is NOT broken:
>>> a = (1,\
... 2)
...
[1, 2]
```

[x] implement normal python lambda functions

[x] sage preparser style mode that makes `^` be exponentiation. Have a bin script `jsage` (instead of `jpython`) that enables this mode everywhere.

- repl has --jsage mode for interaction with everything enabled, but only for interactive use
- for files, instead of .sage files, we have .py files with lines like this at the top:

```py
from __python__ import exponent
```

that switch the parsing mode. This way we can use all the standard py tooling,
and in theory someday change the official python parser to support our custom
syntax, while making it much clearer when we're using our special language and
how, and how to turn on only parts of it. It's also easier to test with
our existing infrastructure. This also makes it possible for a user to write
code that can work in official Python or "preparsed Python".

Things I might want: exponents, [a..b] syntax for ranges (it's a PEP), arbitrary precision integers (wrapping GMP rather than BigInt, since BigInt is way too slow and no rationals).

---

[x] Alternative to raw "v"-strings. These are not valid Python, hence they break all Python tooling (e.g., syntax highlighting, formatting, running the module under real Python, etc.). Instead, replace them by a function call with a normal string. With v-strings you can't even load the code into normal Python since it gets stopped at the parsing stage. It's much better if it is at runtime for normal Python, so you can run the same code with both jpython and normal Python. Example, it would be nice to make something like this possible:

```py
def hello():
    try:
        v"console.log('hello world')"
    except:
        print('hello world')
```

The simplest solution would be this:

```py
def hello():
    try:
        javascript("console.log('hello world')")
    except:
        print('hello world')
```

There could even be a Python fallback to actually try to run the Javascript in some cases.

Another possibility could be to use Python raw strings with some special interpretation of those strings, e.g., `v"` --&gt; r`"something`

```py
r"js:console.log('hello world')"
```

I like using raw since it discourages using formatting characters in the string or thinking javascript(...) is a normal function call with a string -- it isn't since the contents go straight to the output.

Another possibility would be a unicode character to make this even more obfuscated...

```py
r"ρ:console.log('hello world')"
```

Nope that's horrible. It could just be more verbose -- e.g., verbatim: `r"verbatim:console.log"`

Oh, I know, make it like an IPython magic:

```by
r"%js for(i=0;i<10;i++){console.log('blah')}"
```

---

[x] Implement + for lists -- which falls back to string concat right now :frowning:

```py
>>> [1,2,3] + [4,5,6]
[1, 2, 3][4, 5, 6]
```