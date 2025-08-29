import { test } from "node:test";
import { like } from "rich-assert";
import { parseCloze } from "./parser.js";

test("parse mixed", () => {
  like(parseCloze(""), []);
  like(parseCloze("text"), ["text"]);
  like(parseCloze("{{c1::answer}}"), [{ id: "c1", text: ["answer"], hint: null }]);
  like(parseCloze("{{c1::answer::hint}}"), [{ id: "c1", text: ["answer"], hint: "hint" }]);
  like(parseCloze("1{{c1::a1::h1}}2{{c2::a2::h2}}3"), [
    "1",
    { id: "c1", text: ["a1"], hint: "h1" },
    "2",
    { id: "c2", text: ["a2"], hint: "h2" },
    "3",
  ]);
  like(parseCloze("{{c1::aaa{{c2::xxx}}bbb}}"), [
    {
      id: "c1",
      text: ["aaa", { id: "c2", text: ["xxx"], hint: null }, "bbb"],
      hint: null,
    },
  ]);
});
