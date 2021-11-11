import React, { useState } from "react";
import "./App.css";
//TODO: Better styling with Tailwind
//DONE: Simplify Transforms, Formatters and Selectors into a continuous chain of function calls.
//TODO: Introduce the concept of a selector, and integrate it into the mix
//TODO: Delete operation
//TODO: Make it possible to drag one operation to a different location
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

const selectLines = (input: string): string => input;

const selectAll = (input: string): string => input;

function App() {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [generateCount, setGenerateCount] = useState(1);
  const [randomFrom, setRandomFrom] = useState(0);
  const [randomTo, setRandomTo] = useState(100);
  const [operations, setOperations] = useState<Array<Function>>([]);

  //adding
  const doAdd = (
    newFunction: Function,
    collection: Function[],
    add: Function
  ) => add([newFunction].concat(collection));

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
  const render = () => setOutput(perform([...operations], input));
  //setOutput(perform([...transforms], perform([...formats], input)));

  //perform collection on input
  const perform = (collection: Function[], input: string) => {
    let output = input;
    let t: Function | undefined;
    while ((t = collection.pop())) output = t.call(null, output);
    return output;
  };

  return (
    <div className="App container mx-auto">
      <h1>My Little Text Tool</h1>
      <h2>Generator: (overwrites input)</h2>
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
      [<h2>Selectors:</h2>
      <button
        onClick={() => doAdd(selectAll, operations, setOperations)}
        className="action-button"
      >
        All Text
      </button>
      <button
        onClick={() => doAdd(selectLines, operations, setOperations)}
        className="action-button"
      >
        Lines
      </button>
      <h2>Formatters:</h2>
      <div>
        <button
          onClick={() => doAdd(toUpperCase, operations, setOperations)}
          className="action-button"
        >
          UPPERCASE
        </button>
        <button
          onClick={() => doAdd(toLowerCase, operations, setOperations)}
          className="action-button"
        >
          lowercase
        </button>
        <button
          onClick={() => doAdd(capitalizeEveryWord, operations, setOperations)}
          className="action-button"
        >
          Capitalize-Word
        </button>
      </div>
      <h2>Transforms:</h2>
      <div>
        <button
          onClick={() => doAdd(postfixComma, operations, setOperations)}
          className="action-button"
        >
          Postfix Comma
        </button>
        <button
          onClick={() => doAdd(removeWhitespace, operations, setOperations)}
          className="action-button"
        >
          Remove Whitespace
        </button>
      </div>
      <div>Operations:</div>
      <div className="flex space-x-4">
        {[...operations].reverse().map((item: Function, index: number) => (
          <div
            style={{ cursor: "pointer" }}
            className="pill-button"
            key={invertIndex(operations.length, index)}
            onClick={(event) =>
              doRemove(
                invertIndex(operations.length, index),
                operations,
                setOperations
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
