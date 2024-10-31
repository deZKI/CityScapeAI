import React, {useState} from 'react';
import styles from './paneluploadbutton.module.css';
import {setCSVData} from '../../store/csvData/csvDataActions';
import {setLoading} from '../../store/loading/loadingActions';
import {TCSVData} from '../../types/csvData.type';
import {useDispatch} from 'react-redux';
import axios from 'axios';

type TProps = {
  text: string;
}

export default function PanelUplaodButton({ text }: TProps) {
  const [gigachat, setGigachat] = useState(false);
  const dispatch = useDispatch();

  function handleUploadChange(e: any) {
    const API_URL = process.env.REACT_APP_API_URL;
    const file = e.target.files[0];

    dispatch(setLoading(true));

    axios.post(`${API_URL}/advert`, {"file": file, "connect_gigachat": gigachat}, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      const csvData: TCSVData = response.data[0];

      dispatch(setCSVData(csvData));
      dispatch(setLoading(false));
    })
    .catch((err) => {
      console.error(err);
    });
  }

  function handleClick() {
    setGigachat(!gigachat);
  }

  return (
    <>
      <label className={styles.button} htmlFor="upload-button">
        <input id="upload-button" className={styles.input} type="file" accept=".csv" onChange={handleUploadChange} />
        <span className={styles.desc}>{text}</span>
      </label>
      <div className={styles.gigachat}>
        <span className={styles.gigachat__checkbox} onClick={handleClick}>
          {gigachat &&
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 18 14" fill="none">
              <path d="M5.99997 11.1698L1.82997 6.99984L0.409973 8.40984L5.99997 13.9998L18 1.99984L16.59 0.589844L5.99997 11.1698Z" fill="#ffffff"/>
            </svg>
          }
        </span>
        <span className={styles.gigachat__desc}>Gigachat</span>
      </div>
    </>
  )
}
