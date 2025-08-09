import { test } from "node:test";
import { equal } from "rich-assert";
import { formatMath } from "./format-math.js";

test("find inline math", () => {
  equal(formatMath("\\(x\\)"), "<p>\\( x \\)</p>");
  equal(formatMath("a\\(x\\)b"), "<p>a\\( x \\)b</p>");
  equal(formatMath("a\\(x\\)\\(y\\)b"), "<p>a\\( x \\)\\( y \\)b</p>");
  equal(formatMath("\\({x\\)"), "<p>({x)</p>"); // Unbalanced "{".
});

test("find inline math alt", () => {
  equal(formatMath("$x$"), "<p>\\( x \\)</p>");
  equal(formatMath("a$x$b"), "<p>a\\( x \\)b</p>");
  equal(formatMath("a$x$$y$b"), "<p>a\\( x \\)\\( y \\)b</p>");
  equal(formatMath("${x$"), "<p>${x$</p>"); // Unbalanced "{".
});

test("find block math", () => {
  equal(formatMath("\\[x\\]"), "\\[ x \\]");
  equal(formatMath("a\\[x\\]b"), "<p>a</p>\n\\[ x \\]\n<p>b</p>");
  equal(formatMath("a\\[x\\]\\[y\\]b"), "<p>a</p>\n\\[ x \\]\n\\[ y \\]\n<p>b</p>");
  equal(formatMath("\\[{x\\]"), "<p>[{x]</p>"); // Unbalanced "{".
});

test("find block math alt", () => {
  equal(formatMath("$$x$$"), "\\[ x \\]");
  equal(formatMath("a$$x$$b"), "<p>a</p>\n\\[ x \\]\n<p>b</p>");
  equal(formatMath("a$$x$$$$y$$b"), "<p>a</p>\n\\[ x \\]\n\\[ y \\]\n<p>b</p>");
  equal(formatMath("$${x$$"), "<p>$${x$$</p>"); // Unbalanced "{".
});

test("escaped alt", () => {
  equal(formatMath("\\$x$"), "<p>$x$</p>");
  equal(formatMath("$x\\$"), "<p>$x$</p>");
  equal(formatMath("\\$x\\$"), "<p>$x$</p>");
  equal(formatMath("\\$\\$x$$"), "<p>$$x$$</p>");
  equal(formatMath("$$x\\$\\$"), "<p>$$x$$</p>");
  equal(formatMath("\\$\\$x\\$\\$"), "<p>$$x$$</p>");
});

test("ambiguous alt", () => {
  equal(formatMath("$"), "<p>$</p>");
  equal(formatMath("$$"), "<p>$$</p>");
  equal(formatMath("$$$"), "<p>$$$</p>");
  equal(formatMath("$$$$"), "<p>$$$$</p>");
  equal(formatMath("$$$$$"), "<p>$$$$$</p>");
  equal(formatMath("$x"), "<p>$x</p>");
  equal(formatMath("x$"), "<p>x$</p>");
  equal(formatMath("$$x"), "<p>$$x</p>");
  equal(formatMath("x$$"), "<p>x$$</p>");
  equal(formatMath("$$x$"), "<p>$\\( x \\)</p>");
  equal(formatMath("$x$$"), "<p>\\( x \\)$</p>");
  equal(formatMath("$$$x$"), "<p>$$\\( x \\)</p>");
  equal(formatMath("$x$$$"), "<p>\\( x \\)$$</p>");
  equal(formatMath("$$$x$$"), "<p>$</p>\n\\[ x \\]");
  equal(formatMath("$$x$$$"), "\\[ x \\]\n<p>$</p>");
  equal(formatMath("$$$x$$$"), "<p>$</p>\n\\[ x \\]\n<p>$</p>");
  equal(formatMath("$$$$x$$$$"), "<p>$$</p>\n\\[ x \\]\n<p>$$</p>");
});
