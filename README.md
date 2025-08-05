# Tools for Anki Notes

A collection of tools designed for simple and collaborative [Anki](https://apps.ankiweb.net/) note creation.

## Text File Format

The notes are defined in a simple human readable text format, like in the follwing examples.

File `geography.note`:

```
!type: Cloze
!deck: Geography
!tags: Geography Capital

!id: 8ed2ae0e-4141-4969-bbac-b2190c46b8dd
!text: The capital of {{c1::Mongolia::country}} is {{c2::Ulaanbaatar::city}}.
~~~

!id: bd35b5d7-1964-4b2a-a9a9-d7cc44e8283a
!text: The capital of {{c1::Syria::country}} is {{c2::Damascus::city}}.
~~~
```

File `math.note`:

```
!type: Basic
!deck: Math
!tags: Math Equation

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
$ npm install -g @anotes/cli
$ anotes export --dir=notes --out=notes.txt
```

## Visual Studio Code Extension

The Visual Studio Code extension makes it easier to edit note files by providing syntax highlighting and note previews.

![VSCode Screenshot](docs/vscode-screenshot.png)
