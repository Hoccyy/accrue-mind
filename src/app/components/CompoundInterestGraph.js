import React, { useEffect, useRef, useState } from 'react';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js/auto';
import styles from '@/app/page.module.css';

Chart.register(CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement);

const CompoundInterestGraph = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [initialDeposit, setInitialDeposit] = useState(5000);
  const [yearsOfGrowth, setYearsOfGrowth] = useState(5);
  const [rateOfReturn, setRateOfReturn] = useState(0);
  const [compoundFrequency, setCompoundFrequency] = useState(12);
  const [contributionAmount, setContributionAmount] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState(12);
  const [finalBalance, setFinalBalance] = useState(0);

  const currentYear = new Date().getFullYear();

  const formatWithCommas = (value) =>
    value.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const parseWithCommas = (value) =>
    parseFloat(value.replace(/,/g, '') || 0);

  const handleInputChange = (setter) => (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const parsedValue = parseWithCommas(rawValue);
    if (!isNaN(parsedValue)) setter(parsedValue);
  };

  const calculateCompoundInterest = (principal = 0, rate = 0, time = 0, compFreq = 12, contrib = 0, contribFreq = 12) => {
    const compoundingPeriods = time * compFreq;
    const ratePerPeriod = rate / 100 / compFreq;
    let total = principal;

    for (let i = 1; i <= compoundingPeriods; i++) {
      total += contrib * (i % (compFreq / contribFreq) === 0 ? 1 : 0);
      total *= 1 + ratePerPeriod;
    }

    return total;
  };

  const formatYAxisValue = (value) => {
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(1)} T`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)} B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)} MM`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)} K`;
    }
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  };

  useEffect(() => {
    const finalAmount = calculateCompoundInterest(
      initialDeposit || 0,
      rateOfReturn || 0,
      yearsOfGrowth || 0,
      compoundFrequency || 1,
      contributionAmount || 0,
      contributionFrequency || 1
    );
    setFinalBalance(finalAmount);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const midYear = Math.floor(Math.round((yearsOfGrowth || 1) / 2));
    const yearsArray = [currentYear, currentYear + midYear, currentYear + (yearsOfGrowth || 1)];

    // Calculate the compound interest growth
    const amountsArray = [
      initialDeposit,
      calculateCompoundInterest(
        initialDeposit || 0,
        rateOfReturn || 0,
        midYear || 1,
        compoundFrequency || 1,
        contributionAmount || 0,
        contributionFrequency || 1
      ),
      finalAmount,
    ];

    // Dataset for the initial principal
    const principalArray = [initialDeposit, initialDeposit, initialDeposit];

    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: yearsArray,
        datasets: [
          {
            label: 'Total Interest',
            data: amountsArray,
            fill: {
              target: '-1',
              above: 'rgba(75, 192, 75, 0.2)',
            },
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
          },
          {
            label: 'Total Principal',
            data: principalArray,
            borderColor: 'rgba(54, 162, 235, 1)',
            borderDash: [5, 5],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Compound Interest Over ${yearsOfGrowth || 0} Years`,
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `$${context.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            },
          },
          legend: {
            position: 'bottom',
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Year',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Amount ($)',
            },
            ticks: {
              maxTicksLimit: 7,
              stepSize: Math.ceil((Math.max(...amountsArray) - Math.min(...amountsArray)) / 5),
              callback: (value) => formatYAxisValue(value),
            },
          },
        },
      },
    });

    chartInstanceRef.current = chartInstance;

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [initialDeposit, yearsOfGrowth, rateOfReturn, compoundFrequency, contributionAmount, contributionFrequency]);

  return (
    <div style={{ display: 'flex' }} className={styles.primaryContainer}>
      <div style={{ width: '213px', marginRight: '20px' }}>
        <h3 className={styles.subheader}>Investment Details</h3>
        <div>
          <label className={styles.label}>Initial Deposit ($):</label>
          <input
            type="text"
            value={formatWithCommas(initialDeposit)}
            onChange={handleInputChange(setInitialDeposit)}
            className={styles.inputBox}
          />
        </div>

        <div>
          <label className={styles.label}>Years of Growth:</label>
          <input
            type="text"
            value={yearsOfGrowth}
            onChange={handleInputChange(setYearsOfGrowth)}
            className={styles.inputBox}
          />
        </div>

        <div>
          <label className={styles.label}>Rate of Return (%):</label>
          <input
            type="number"
            step="0.1"
            value={rateOfReturn}
            onChange={handleInputChange(setRateOfReturn)}
            className={styles.inputBox}
          />
        </div>

        <div>
          <label className={styles.label}>Compound Frequency (times per year):</label>
          <select
            value={compoundFrequency}
            onChange={(e) => setCompoundFrequency(Number(e.target.value))}
            className={styles.inputRadioBox}
          >
            <option value={1}>Annually</option>
            <option value={2}>Semi-Annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>

        <div>
          <label className={styles.label}>Contribution Amount ($):</label>
          <input
            type="text"
            value={formatWithCommas(contributionAmount)}
            onChange={handleInputChange(setContributionAmount)}
            className={styles.inputBox}
          />
        </div>
        
        <div>
          <label className={styles.label}>Contribution Frequency (times per year):</label>
          <select
            value={contributionFrequency}
            onChange={(e) => setContributionFrequency(Number(e.target.value))}
            className={styles.inputRadioBox}
          >
            <option value={1}>Annually</option>
            <option value={2}>Semi-Annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div id="totalBalance">
          <h2>Total Balance</h2>
          <h1
            style={{
              color: finalBalance >= 0 ? '#5c9e5e' : '#c41616',
            }}
          >
            ${finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
        </div>
        <canvas ref={chartRef} className={styles.chartCanvas}></canvas>
      </div>
    </div>
  );
};

export default CompoundInterestGraph;
