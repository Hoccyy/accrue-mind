'use client';
import styles from "./page.module.css";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import InterestGraph from './components/InterestGraph';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading screen module */}
      {loading && (
        <div className={styles.loadingScreen}>
          <h1>AccrueMind™</h1>
          <p className={styles.subtitle}>No limit.</p>
        </div>
      )}

      {/* Main content */}
      <div className={`${styles.content} ${loading ? styles.hidden : ''}`}>

        <div className={styles.center}>
          <h2 className={styles.logo}>AccrueMind</h2>
          <InterestGraph/>

        <div className={styles.footer}>
          <Link target='_blank' href='http://github.com/Hoccyy'>
            <p>@Hoccyy.</p>
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}
