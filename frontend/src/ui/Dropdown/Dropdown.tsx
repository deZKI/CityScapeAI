import React, {useState} from 'react';
import styles from './dropdown.css';
import {generateRandomString} from '../../utils/generateRandomString';

type TProps = {
  button: React.ReactNode;
  list: string[];
}

export function Dropdown({ button, list }: TProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function handleClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <div className={styles.container}>
      <div onClick={handleClick}>{button}</div>
      {isDropdownOpen && (
        <ul className={styles.list} onClick={() => setIsDropdownOpen(false)}>
          {list.map((item) => 
            <li className={styles.item} key={generateRandomString()}>
              <span className={styles.description}>{item}</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
