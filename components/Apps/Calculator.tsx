import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (operator && !waitingForNewValue && prevValue) {
      const result = calculate(prevValue, display, operator);
      setDisplay(String(result));
      setPrevValue(String(result));
    } else {
      setPrevValue(display);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const calculate = (a: string, b: string, op: string) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    switch (op) {
      case '+': return numA + numB;
      case '-': return numA - numB;
      case '×': return numA * numB;
      case '÷': return numB !== 0 ? numA / numB : 'Error';
      default: return numB;
    }
  };

  const handleEqual = () => {
    if (operator && prevValue) {
      const result = calculate(prevValue, display, operator);
      setDisplay(String(result));
      setPrevValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const btnClass = "h-12 rounded-full text-white text-xl font-medium transition-colors active:opacity-70 flex items-center justify-center";
  const grayBtn = `${btnClass} bg-gray-500 hover:bg-gray-400`;
  const orangeBtn = `${btnClass} bg-orange-500 hover:bg-orange-400`;
  const darkBtn = `${btnClass} bg-gray-700 hover:bg-gray-600`;

  return (
    <div className="flex flex-col h-full bg-gray-900 p-4 select-none">
      <div className="flex-1 flex items-end justify-end mb-4">
        <div className="text-5xl text-white font-light truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <button className={grayBtn} onClick={handleClear}>AC</button>
        <button className={grayBtn} onClick={() => setDisplay(String(parseFloat(display) * -1))}>+/-</button>
        <button className={grayBtn} onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</button>
        <button className={orangeBtn} onClick={() => handleOperator('÷')}>÷</button>

        <button className={darkBtn} onClick={() => handleNumber('7')}>7</button>
        <button className={darkBtn} onClick={() => handleNumber('8')}>8</button>
        <button className={darkBtn} onClick={() => handleNumber('9')}>9</button>
        <button className={orangeBtn} onClick={() => handleOperator('×')}>×</button>

        <button className={darkBtn} onClick={() => handleNumber('4')}>4</button>
        <button className={darkBtn} onClick={() => handleNumber('5')}>5</button>
        <button className={darkBtn} onClick={() => handleNumber('6')}>6</button>
        <button className={orangeBtn} onClick={() => handleOperator('-')}>-</button>

        <button className={darkBtn} onClick={() => handleNumber('1')}>1</button>
        <button className={darkBtn} onClick={() => handleNumber('2')}>2</button>
        <button className={darkBtn} onClick={() => handleNumber('3')}>3</button>
        <button className={orangeBtn} onClick={() => handleOperator('+')}>+</button>

        <button className={`${darkBtn} col-span-2 items-start pl-6`} onClick={() => handleNumber('0')}>0</button>
        <button className={darkBtn} onClick={() => handleNumber('.')}>.</button>
        <button className={orangeBtn} onClick={handleEqual}>=</button>
      </div>
    </div>
  );
};

export default Calculator;