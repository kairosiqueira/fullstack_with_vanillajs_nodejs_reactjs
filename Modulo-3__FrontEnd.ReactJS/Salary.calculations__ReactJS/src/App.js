import React, { useState, useEffect } from 'react';
import {calculateSalaryFrom,calcPercentage,formatMoney} from './util/salary';
import InputReadOnly from './components/input-read-only';
import ProgressBar from './components/progress-bar';

import './App.css';

function App() {
  const [grossSalary, setGrossSalary] = useState('');
  const [baseINSS, setBaseINSS] = useState(0);
  const [baseIRPF, setBaseIRPF] = useState(0);
  const [discountINSS, setDiscountINSS] = useState(0);
  const [discountIRPF, setDiscountIRPF] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

  const [percentageDiscountINSS, setPercentageDiscountINSS] = useState(0);
  const [percentageDiscountIRPF, setPercentageDiscountIRPF] = useState(0);
  const [percentageNetSalary, setPercentageNetSalary] = useState(0);

  useEffect(() => {
    const result = calculateSalaryFrom(grossSalary);

    const percentageDiscountINSS = calcPercentage(grossSalary, result.discountINSS);
    const percentageDiscountIRPF = calcPercentage(grossSalary, result.discountIRPF);
    const percentageNetSalary = calcPercentage(grossSalary, result.netSalary);

    setPercentageDiscountINSS(percentageDiscountINSS);
    setPercentageDiscountIRPF(percentageDiscountIRPF);
    setPercentageNetSalary(percentageNetSalary);
    setBaseINSS(formatMoney(result.baseINSS));
    setBaseIRPF(formatMoney(result.baseIRPF));
    setDiscountINSS(`${formatMoney(result.discountINSS)} (${percentageDiscountINSS}%)`);
    setDiscountIRPF(`${formatMoney(result.discountIRPF)} (${percentageDiscountIRPF}%)`);
    setNetSalary(`${formatMoney(result.netSalary)} (${percentageNetSalary}%)`);

  }, [grossSalary]);

  return (
    <div className="container">
      <h1 className="text-center mt-3">Wage calculations</h1>
      
      <div className="form-row">
        <div className="form-group col">
          <label><b>Gross salary</b></label>
            <input 
              type="number"
              className="form-control"
              placeholder="Salário Bruto"
              value={grossSalary}
              onChange={event => setGrossSalary(event.target.value)}
              autoFocus
            />
        </div>
      </div>

      <div className="form-row">
        <InputReadOnly
          className="col-xs-12 col-sm-6 col-md-3"
          label="INSS Base"
          value={baseINSS}
        />

        <InputReadOnly
          className="discount-inss col-xs-12 col-sm-6 col-md-3"
          label="INSS Discount"
          value={discountINSS}
        />

        <InputReadOnly
          className="col-xs-12 col-sm-6 col-md-3"
          label="IRPF Base"
          value={baseIRPF}
        />

        <InputReadOnly
          className="discount-irpf col-xs-12 col-sm-6 col-md-3"
          label="IRPF Discount"
          value={discountIRPF}
        />
      </div>

      <div className="form-row">
        <InputReadOnly
          className="net-salary col"
          label="Net Salary"
          value={netSalary}
        />
      </div>

      <ProgressBar
        percentageDiscountINSS={percentageDiscountINSS}
        percentageDiscountIRPF={percentageDiscountIRPF}
        percentageNetSalary={percentageNetSalary}
      />
    </div>
  );
}

export default App;
