import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ResultsSlider from "../ResultsSlider/ResultsSlider";
import ListDocs from "../ListDocs/ListDocs";
import styles from "./Results.module.css";
import { useEffect, useState } from "react";
import { getHistograms, getPublications } from "../../store";

const Results = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1320);
  const dispatch = useDispatch();
  const { formData } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1320);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (formData) {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  const [histograms, setHistogarms] = useState(null);
  const [publications, setPublications] = useState(null);
  const token = useSelector((state) => state.token.value);

  useEffect(() => {
    const fetchHistogramsData = async () => {
      setIsLoading(true);

      try {
        Axios.post(
          "https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms",
          JSON.parse(localStorage.getItem("formData")),
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        ).then((response) => {
          dispatch(getHistograms(response.data));
          localStorage.setItem("histograms", JSON.stringify(response));
          setHistogarms(JSON.parse(localStorage.getItem("histograms")));
        });
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchHistogramsData();
  }, []);

  useEffect(() => {
    const fetchPublicationsData = async () => {
      setIsLoading(true);

      try {
        await Axios.post(
          "https://gateway.scan-interfax.ru/api/v1/objectsearch",
          JSON.parse(localStorage.getItem("formData")),
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        ).then((response) => {
          dispatch(getPublications(response.data));
          localStorage.setItem("publications", JSON.stringify(response));
          setPublications(JSON.parse(localStorage.getItem("publications")));
        });
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchPublicationsData();
  }, []);

  // Окончание слова "вариант"
  const getWordEnding = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "ов";
    } else if (lastDigit === 1) {
      return "а";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return "а";
    } else {
      return "ов";
    }
  };

  return (
    <div className={styles.resultsContainer}>
      <h1
        className="title titlePages"
        style={{ maxWidth: "509px", letterSpacing: "0.04em" }}
      >
        Ищем. Скоро будут результаты
      </h1>
      <p className={styles.underTitle}>
        Поиск может занять некоторое время, <br /> просим сохранять терпение.
      </p>
      <h3 className={styles.resultsTitle} style={{ marginTop: !isMobile ? "127px" : "314px"}}>
        Общая сводка
      </h3>
      {!isLoading && (<p className={styles.optionsFound}>
        Найдено {publications.data.items.length} вариант
        {getWordEnding(publications.data.items.length)}
      </p>)}
      <ResultsSlider
        isLoading={isLoading}
        histograms={histograms}
        publications={publications}
        className={styles.slider}
      />
      <h3 className={styles.resultsTitle} style={{ marginTop: !isMobile ? "107px" : "57px" }}>
        Список документов
      </h3>
      {!isLoading && (<ListDocs publications={publications} /> )}
    </div>
  );
};

export default Results;
