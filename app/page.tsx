"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [given, setGiven] = useState("");
  const [observed, setObserved] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>("Input R, B, and X to start.");

  const handleGivenChange = (value: string) => {
    const validInput = value.toUpperCase().replace(/[^RBX]/g, "").slice(0, 17);
    setGiven(validInput);
  };

  const handleObservedChange = (value: string) => {
    const validInput = value.toUpperCase().replace(/[^RBX]/g, "").slice(0, 17);
    setObserved(validInput);
  };
  
  const countOccurrences = (str: string, char: string) => {
    return str.split('').filter(c => c === char).length;
  };

  const calculateProbability = (given: string, observed: string) => {
    const totalR = 11;
    const totalB = 6;
    const deckSize = totalR + totalB;
  
    const givenR = countOccurrences(given, 'R');
    const givenB = countOccurrences(given, 'B');
    const givenX = countOccurrences(given, 'X');
  
    const observedR = countOccurrences(observed, 'R');
    const observedB = countOccurrences(observed, 'B');
    const observedX = countOccurrences(observed, 'X');
  
    // Remaining cards in the deck after given cards are considered
    const remainingRGiven = totalR - givenR;
    const remainingBGiven = totalB - givenB;
    const remainingRObserved = totalR - observedR;
    const remainingBObseved = totalB - observedB;
  
    if (remainingRGiven < 0 || remainingBGiven < 0) {
      setError("Invalid input: more cards given than in the deck.");
      return null;
    }
  
    // The probability is just P(observed) / P(given)
    const factorial = (n: number): number => {
      if (n === 0 || n === 1) return 1;
      return n * factorial(n - 1);
    };

    // = ways to permute remaining cards in original deck / ways to permute remaining cards in observed deck
    const waysToPermuteGiven = factorial(remainingRGiven + remainingBGiven)/(factorial(remainingRGiven) * factorial(remainingBGiven));
    const waysToPermuteObserved = factorial(remainingRObserved + remainingBObseved)/(factorial(remainingRObserved) * factorial(remainingBObseved));

    // The probability can be a combination of R and B probabilities based on observed input
    const totalProbability = (waysToPermuteObserved) / waysToPermuteGiven;
  
    return Math.min(totalProbability, 1);
  };
  

  useEffect(() => {
    if (given.length > 17 || observed.length > 17) {
      setError("Input length cannot be greater than 17 characters.");
    } else if (given.length != observed.length) {
      setError("Input lengths must match. Use X as placeholder for unknowns.");
    } else if (given.length == 0 && observed.length == 0){
      setError("Input R, B, and X to start.");
    } else if (countOccurrences(given, 'R') > 11 || countOccurrences(observed, 'R') > 11) {
      setError("Invalid input: there are only 11 R cards in the deck.");
    } else if (countOccurrences(given, 'B') > 6 || countOccurrences(observed, 'B') > 6) {
      setError("Invalid input: there are only 6 B cards in the deck.");
    } else {
      // check valid order
      let isValid = true;
      var index = 0;
      console.log("given is " + given);
      console.log("observed is " + observed);
      console.log("given length is " + given.length);
      for (index = 0; index <= given.length; index++) {
        if (given[index] !== observed[index] && observed[index] !== 'X' && given[index] !== 'X') {
          console.log("failing on index " + index);
          isValid = false;
          break;
        }
      }
      console.log("index is " + index);
      if (isValid) {
        setError(null);
        setResult(calculateProbability(given, observed));
      } else {
        setError("Impossible to be given " + given[index] + " but see " + observed[index] + " on index " + index + ".");
      }
    }
  }, [given, observed]);


  return (
    <main className={styles.main}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Jon the Quantitative</h2>
          <div>Order matters.</div>
          <div className={styles.inputGroup}>
            <label>Given that the following is true:</label>
            <input
              type="text"
              value={given}
              onChange={(e) => handleGivenChange(e.target.value)}
              placeholder="Enter R, B, or X (max 17)"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Chances of seeing:</label>
            <input
              type="text"
              value={observed}
              onChange={(e) => handleObservedChange(e.target.value)}
              placeholder="Enter R, B, or X (max 17)"
            />
          </div>
          <div className={styles.inputGroup}>
            <h3>Probability:</h3>
            {error ? (
              <div>Error: {error}</div>
            ) : (
              <div className={styles.result}>
                {result !== null ? <p>{result.toFixed(2)}</p> : <p>N/A</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
