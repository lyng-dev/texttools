import React, { useState } from "react";
import "./App.css";

//TODO: Better styling with Tailwind
//DONE: CapitalizeEveryWord
//DONE: perform functions can be joined into a generic implementation
//DONE: adding elements to trasnofrm and format can be made generic as well
//DONE: add random number generator

const invertIndex = (size: number, index: number) => Math.abs(size - 1 - index);

const generateUUID = (): string => {
  return "XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX".replace(/[XY]/g, (match) => {
    const hexdec = (Math.random() * 16) | 0,
      value = match === "X" ? hexdec : (hexdec & 0x3) | 0x8;
    return value.toString(16);
  });
};

const generateRandomNumber = ([from, to]: number[]) => {
  return Math.floor(Math.random() * (to - from) + from).toString();
};

const regexReplace = (
  input: string,
  regex: RegExp,
  replacer: (x: string, y: any[]) => string
) => input.replace(regex, replacer);

const postfixComma = (input: string): string =>
  regexReplace(input, /[\n]/g, () => ",\n");

const removeWhitespace = (input: string): string =>
  regexReplace(input, /[\x00-\x1F\x80-\xFF\ ]/g, () => "");

const capitalizeEveryWord = (input: string): string =>
  regexReplace(input, /(\b[a-z](?!\s))/g, (substring: string, __: any[]) =>
    substring.toUpperCase()
  );

const toUpperCase = (input: string): string => input.toUpperCase();

const toLowerCase = (input: string): string => input.toLowerCase();

function App() {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [generateCount, setGenerateCount] = useState(1);
  const [randomFrom, setRandomFrom] = useState(0);
  const [randomTo, setRandomTo] = useState(100);
  const [formats, setFormats] = useState<Array<Function>>([]);
  const [transforms, setTransforms] = useState<Array<Function>>([]);

  //adding
  const doAdd = (
    newFunction: Function,
    collection: Function[],
    add: Function
  ) => add([newFunction].concat(collection));

  //running generators
  const doGenerate = (
    generator: Function,
    count: number,
    ...args: (number | undefined)[]
  ) => {
    const generatedValues = [...Array(count)].map(() => generator(args));
    setOutput("");
    setInput(generatedValues.join("\n"));
  };

  //render output, from performing all actions
  const render = () =>
    setOutput(perform([...transforms], perform([...formats], input)));

  //perform collection on input
  const perform = (collection: Function[], input: string) => {
    let output = input;
    let t: Function | undefined;
    while ((t = collection.pop())) output = t.call(null, output);
    return output;
  };

  //remove from collection
  const doRemove = (
    index: number,
    collection: Function[],
    remove: Function
  ) => {
    const currentCollection = [...collection];
    currentCollection.splice(index, 1);
    remove(currentCollection);
  };

  return (
    <div className="App">
      <h1>Generator: (overwrites input)</h1>
      Count:
      <input
        type="number"
        name="generateCount"
        id="generateCount"
        defaultValue={1}
        min={1}
        size={3}
        onChange={(event) =>
          setGenerateCount(parseInt(event.currentTarget.value))
        }
      />
      Type:
      <button
        onClick={() => doGenerate(generateUUID, generateCount)}
        className="action-button"
      >
        GUID
      </button>{" "}
      <button
        onClick={() =>
          doGenerate(generateRandomNumber, generateCount, randomFrom, randomTo)
        }
        className="action-button"
      >
        Numbers
      </button>{" "}
      [
      <input
        type="number"
        name="randomFrom"
        id="randomFrom"
        defaultValue={0}
        min={0}
        size={3}
        placeholder="from"
        onChange={(event) => setRandomFrom(parseInt(event.currentTarget.value))}
      />
      <input
        type="number"
        name="randomTo"
        id="randomTo"
        defaultValue={100}
        min={1}
        size={3}
        placeholder="to"
        onChange={(event) => setRandomTo(parseInt(event.currentTarget.value))}
      />
      [<div>Formatters:</div>
      <div>
        <button
          onClick={() => doAdd(toUpperCase, formats, setFormats)}
          className="action-button"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => doAdd(toLowerCase, formats, setFormats)}
          className="action-button"
        >
          lowercase
        </button>
        <button
          onClick={() => doAdd(capitalizeEveryWord, formats, setFormats)}
          className="action-button"
        >
          Capitalize-Word
        </button>
      </div>
      <div>Selected:</div>
      <div className="flex space-x-4">
        {[...formats].reverse().map((item: Function, index: number) => (
          <div
            style={{ cursor: "pointer" }}
            className="pill-button"
            key={invertIndex(formats.length, index)}
            onClick={(event) =>
              doRemove(invertIndex(formats.length, index), formats, setFormats)
            }
          >
            {item.name} (x)
          </div>
        ))}
      </div>
      <div>Transformations:</div>
      <div>
        <button
          onClick={() => doAdd(postfixComma, transforms, setTransforms)}
          className="action-button"
        >
          Postfix Comma
        </button>
        <button
          onClick={() => doAdd(removeWhitespace, transforms, setTransforms)}
          className="action-button"
        >
          Remove Whitespace
        </button>
      </div>
      <div>Selected:</div>
      <div className="flex space-x-4">
        {[...transforms].reverse().map((item: Function, index: number) => (
          <div
            style={{ cursor: "pointer" }}
            className="pill-button"
            key={invertIndex(transforms.length, index)}
            onClick={(event) =>
              doRemove(
                invertIndex(transforms.length, index),
                transforms,
                setTransforms
              )
            }
          >
            {item.name} (x)
          </div>
        ))}
      </div>
      <div>
        <div>Input:</div>
        <div>
          <textarea
            cols={30}
            rows={10}
            onChange={(event) => setInput(event.target.value)}
            value={input}
          ></textarea>
        </div>
      </div>
      <div>
        <div>Output:</div>
        <div>
          <textarea cols={30} rows={10} defaultValue={output}></textarea>
        </div>
      </div>
      <button onClick={() => render()} className="action-button">
        Execute
      </button>
    </div>
  );
}

export default App;
