# Write Anki Notes in Visual Studio Code

This extension allows you to write Anki notes in a simple human-readable text file, then export them to Anki.

The file format is a collection of field-value pairs, as in the following example:

File `astronomy.note`:

```
!type: Basic
!deck: Astronomy
!tags: Astronomy

!front: The first planet from the Sun.
!back: Mercury
~~~

!front: The second planet from the Sun.
!back: Venus
~~~

!front: The largest planet in the Solar System.
!back: Jupiter
~~~
```

The file above defines three Basic notes, each with a front and a back.

The outer level of the file is a collection of notes, each of which is a collection of fields.
Each field is written in the Markdown format and can include mathematical expressions written with LaTeX.

File `math.note`:

```
!type: Basic
!deck: Math
!tags: Math Theorem

!front: Mean Value Theorem
!back:
The **Mean Value Theorem** states that if a function $f$ is continuous on the closed
interval $[a, b]$ and differentiable on the open interval $(a, b)$, then there exists
at least one $c \in (a, b)$ such that

$$ f'(c) = \frac{f(b) - f(a)}{b - a} $$
~~~
```

# Features

## Preview

todo

## Syntax Highlighting

todo

## Autocompletion

todo

## Automatic Note ID Insertion



todo

## Export to Anki

todo
