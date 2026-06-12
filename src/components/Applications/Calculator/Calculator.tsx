import { useState } from "react";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [lastResult, setLastResult] = useState("");

  const handleNumber = (num: string) => {
    setDisplay(display === "0" ? num : display + num);
    setEquation(equation + num);
  };

  const handleOperator = (op: string) => {
    setEquation(equation + " " + op + " ");
    setDisplay(op);
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setLastResult("");
  };

  const handleCalculate = () => {
    try {
      const result = eval(equation);
      setDisplay(result.toString());
      setLastResult(equation + " = " + result);
      setEquation(result.toString());
    } catch {
      setDisplay("Error");
      setEquation("");
      setTimeout(() => handleClear(), 1500);
    }
  };

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const getOperatorSymbol = (op: string) => {
    if (op === "÷") return "/";
    if (op === "×") return "*";
    return op;
  };

  return (
    <div className="flex flex-col flex-1 max-h-full overflow-y-auto bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="max-w-sm mx-auto w-full p-6">
        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            Calculator
          </h1>

          <div className="bg-gray-800 rounded-xl p-4 mb-4">
            <div className="text-gray-400 text-sm h-6 truncate">
              {equation || lastResult}
            </div>
            <div className="text-white text-3xl font-mono truncate">
              {display}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex gap-3 mb-2">
              <button
                onClick={handleClear}
                className="flex-1 bg-red-500 text-white py-4 rounded-xl text-xl font-semibold hover:bg-red-600 transition-colors"
              >
                C
              </button>
              <button
                onClick={() => handleOperator("÷")}
                className="flex-1 bg-primary text-gray-800 py-4 rounded-xl text-xl font-semibold hover:opacity-80 transition-colors"
              >
                ÷
              </button>
            </div>

            {buttons.map((row, i) => (
              <div key={i} className="flex gap-3">
                {row.map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === "=") handleCalculate();
                      else if (["÷", "×", "-", "+"].includes(btn))
                        handleOperator(getOperatorSymbol(btn));
                      else handleNumber(btn);
                    }}
                    className={`flex-1 py-4 rounded-xl text-xl font-semibold transition-all ${
                      ["÷", "×", "-", "+"].includes(btn)
                        ? "bg-primary text-gray-800 hover:opacity-80"
                        : btn === "="
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-4">
          ℹ️ Basic calculator with standard operations
        </p>
      </div>
    </div>
  );
};
