"use client";

import { useState, useCallback, useMemo, createContext, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuConfig } from "@/components/os/DynamicMenu";
import { useMenuRegistry } from "@/components/os/MenuRegistryContext";

type Operation = '+' | '-' | '×' | '÷' | null;

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: Operation;
  waitingForOperand: boolean;
  memory: number;
}

const initialState: CalculatorState = {
  display: '0',
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  memory: 0,
};

export interface CalculatorProps {
  onMenuConfig?: (config: MenuConfig[]) => void;
}

export function Calculator({ onMenuConfig }: CalculatorProps = {}) {
  const [state, setState] = useState<CalculatorState>(initialState);
  const { registerMenu, unregisterMenu } = useMenuRegistry();

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: num,
          waitingForOperand: false,
        };
      }

      if (prevState.display === '0') {
        return {
          ...prevState,
          display: num,
        };
      }

      return {
        ...prevState,
        display: prevState.display + num,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return {
          ...prevState,
          display: '0.',
          waitingForOperand: false,
        };
      }

      if (prevState.display.indexOf('.') === -1) {
        return {
          ...prevState,
          display: prevState.display + '.',
        };
      }

      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  const clearEntry = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0',
    }));
  }, []);

  const performOperation = useCallback((nextOperation: Operation) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForOperand: true,
        };
      }

      if (prevState.operation && prevState.waitingForOperand) {
        return {
          ...prevState,
          operation: nextOperation,
        };
      }

      const result = calculate(prevState.previousValue, inputValue, prevState.operation!);

      return {
        ...prevState,
        display: String(result),
        previousValue: result,
        operation: nextOperation,
        waitingForOperand: true,
      };
    });
  }, []);

  const calculate = (firstValue: number, secondValue: number, operation: Operation): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const equals = useCallback(() => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue === null || prevState.operation === null) {
        return prevState;
      }

      const result = calculate(prevState.previousValue, inputValue, prevState.operation);

      return {
        ...prevState,
        display: String(result),
        previousValue: null,
        operation: null,
        waitingForOperand: true,
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: prevState.display.startsWith('-')
        ? prevState.display.slice(1)
        : '-' + prevState.display,
    }));
  }, []);

  const backspace = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForOperand) {
        return prevState;
      }

      const newDisplay = prevState.display.slice(0, -1) || '0';

      return {
        ...prevState,
        display: newDisplay,
      };
    });
  }, []);

  // Memory functions
  const memoryAdd = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: prevState.memory + parseFloat(prevState.display),
    }));
  }, []);

  const memorySubtract = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: prevState.memory - parseFloat(prevState.display),
    }));
  }, []);

  const memoryRecall = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: String(prevState.memory),
      waitingForOperand: true,
    }));
  }, []);

  const memoryClear = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      memory: 0,
    }));
  }, []);

  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }

    // Format with appropriate decimal places
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 10,
    });
  };

  // Register calculator menu when component mounts
  useEffect(() => {
    const calculatorMenu: MenuConfig[] = [
      {
        label: 'Calculator',
        content: [
          {
            type: 'item',
            label: 'Copy Result',
            shortcut: { keys: '⌘C' },
            onClick: () => {
              navigator.clipboard.writeText(state.display).then(() => {
                console.log('Result copied to clipboard');
              });
            }
          },
          {
            type: 'item',
            label: 'Clear All',
            shortcut: { keys: '⌘⌫' },
            onClick: clear
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            label: 'Show Memory Indicator',
            checked: true,
            onCheckedChange: (checked) => {
              console.log('Memory indicator:', checked ? 'shown' : 'hidden');
            }
          }
        ]
      },
      {
        label: 'Memory',
        content: [
          {
            type: 'item',
            label: 'Memory Store (M+)',
            shortcut: { keys: '⌘M' },
            onClick: memoryAdd
          },
          {
            type: 'item',
            label: 'Memory Subtract (M-)',
            onClick: memorySubtract
          },
          {
            type: 'item',
            label: 'Memory Recall (MR)',
            onClick: memoryRecall
          },
          {
            type: 'item',
            label: 'Memory Clear (MC)',
            onClick: memoryClear
          }
        ]
      }
    ];

    // Register with exclusive flag to take full control of the menu
    registerMenu('calculator-menu', calculatorMenu, {
      componentName: 'Calculator',
      priority: 'high',
      mergeStrategy: 'append',
      exclusive: true // New: This menu will be exclusive
    });

    return () => {
      unregisterMenu('calculator-menu');
    };
  }, [state.display, registerMenu, unregisterMenu, clear, memoryAdd, memorySubtract, memoryRecall, memoryClear]);

  return (
    <div className="w-full mx-auto p-4 rounded-lg">
      {/* Display */}
      <div className="mb-4 p-4 bg-black text-white text-right text-2xl font-mono rounded min-h-[60px] flex items-center justify-end overflow-hidden">
        <span className="truncate">{formatDisplay(state.display)}</span>
      </div>

      {/* Memory indicator */}
      {state.memory !== 0 && (
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          M: {formatDisplay(String(state.memory))}
        </div>
      )}

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 - Memory and Clear functions */}
        <Button
          variant="outline"
          size="sm"
          onClick={memoryClear}
          className="text-xs"
        >
          MC
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={memoryRecall}
          className="text-xs"
        >
          MR
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={memoryAdd}
          className="text-xs"
        >
          M+
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={memorySubtract}
          className="text-xs"
        >
          M-
        </Button>

        {/* Row 2 - Clear functions */}
        <Button
          variant="outline"
          onClick={clear}
          className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
        >
          C
        </Button>
        <Button
          variant="outline"
          onClick={clearEntry}
        >
          CE
        </Button>
        <Button
          variant="outline"
          onClick={backspace}
        >
          ⌫
        </Button>
        <Button
          variant="outline"
          onClick={() => performOperation('÷')}
          className={cn(
            "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800",
            state.operation === '÷' && "ring-2 ring-blue-500"
          )}
        >
          ÷
        </Button>

        {/* Row 3 - Numbers and multiplication */}
        <Button
          variant="outline"
          onClick={() => inputNumber('7')}
        >
          7
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('8')}
        >
          8
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('9')}
        >
          9
        </Button>
        <Button
          variant="outline"
          onClick={() => performOperation('×')}
          className={cn(
            "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800",
            state.operation === '×' && "ring-2 ring-blue-500"
          )}
        >
          ×
        </Button>

        {/* Row 4 - Numbers and subtraction */}
        <Button
          variant="outline"
          onClick={() => inputNumber('4')}
        >
          4
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('5')}
        >
          5
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('6')}
        >
          6
        </Button>
        <Button
          variant="outline"
          onClick={() => performOperation('-')}
          className={cn(
            "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800",
            state.operation === '-' && "ring-2 ring-blue-500"
          )}
        >
          -
        </Button>

        {/* Row 5 - Numbers and addition */}
        <Button
          variant="outline"
          onClick={() => inputNumber('1')}
        >
          1
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('2')}
        >
          2
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('3')}
        >
          3
        </Button>
        <Button
          variant="outline"
          onClick={() => performOperation('+')}
          className={cn(
            "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800",
            state.operation === '+' && "ring-2 ring-blue-500"
          )}
        >
          +
        </Button>

        {/* Row 6 - Zero, decimal, sign, and equals */}
        <Button
          variant="outline"
          onClick={toggleSign}
          className="text-sm"
        >
          ±
        </Button>
        <Button
          variant="outline"
          onClick={() => inputNumber('0')}
          className="col-span-1"
        >
          0
        </Button>
        <Button
          variant="outline"
          onClick={inputDecimal}
        >
          .
        </Button>
        <Button
          onClick={equals}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          =
        </Button>
      </div>
    </div>
  );
}
