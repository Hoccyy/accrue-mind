import React, { useState } from 'react';
import styles from './InterestGraph.module.css';
import CompoundInterestGraph from './CompoundInterestGraph';

const InterestGraph = () => {

  return (
    <div className={styles.graphContainer}>
      <div className={styles.inputGroup}>
        <CompoundInterestGraph/>
      </div>
    </div>

  );
};

export default InterestGraph;
