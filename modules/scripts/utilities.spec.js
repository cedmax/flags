import { classifyColor } from "./utilities";

const fixHue = (hue) => hue / 360;

const testCases = [
  { lgt: 0.09, sat: 1, hue: fixHue(30), result: "black" },
  { lgt: 0.9, sat: 1, hue: fixHue(31), result: "white" },
  { lgt: 0.5, sat: 0.18, hue: fixHue(25), result: "gray" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(24), result: "red" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(29), result: "red" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(30), result: "yellow" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(89), result: "yellow" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(90), result: "green" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(120), result: "green" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(180), result: "cyan" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(181), result: "cyan" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(210), result: "blue" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(211), result: "blue" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(270), result: "magenta" },
  { lgt: 0.5, sat: 0.5, hue: fixHue(330), result: "red" },
];

describe("classify colors", () => {
  testCases.forEach(({ result, ...color }, i) => {
    test(`case #${i} - { sat: ${color.sat}, lgt: ${color.lgt}, hue: ${
      color.hue * 360
    } }`, () => {
      expect(classifyColor(color)).toBe(result);
    });
  });
});
