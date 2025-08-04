# Tools for Anki Notes

A collection of tools designed for simple and collaborative [Anki](https://apps.ankiweb.net/) note creation.

## Text File Format

The notes are defined in a simple human readable text format, like in the follwing examples.

File `geography.note`:

```
!type: Basic
!deck: Geography
!tags: Geography Capital

!front: The capital of Mongolia
!back: Ulaanbaatar
~~~

!front: The capital of Syria
!back: Damascus
~~~
```

File `math.note`:

```
!type: Basic
!deck: Math
!tags: Math Equation

!front: The quadratic equation
!back:
If $$ ax^2 + bx + c = 0 $$ then $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}. $$

If $b^2 < 4ac$ then there are no real solutions.
~~~

!front: Euler's formula
!back:
$$
\begin{align}
    e^{ix}  &= \cos x + i \sin x \\
    e^{-ix} &= \cos x - i \sin x
\end{align*}
$$
~~~
```

## Command Line Tools

The tool `anotes` scans the given directory for all `*.note` files and compiles them into an output deck that can be
imported into Anki.

```shell
$ npm install @anotes/cli
$ anotes export --dir=notes --out=notes.txt
```

## Visual Studio Code Extension

The Visual Studio Code extension makes it easier to edit note files by providing syntax highlighting and note previews.

![VSCode Screenshot](docs/vscode-screenshot.png)
