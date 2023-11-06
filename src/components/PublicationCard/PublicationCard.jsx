import DOMPurify from "dompurify";
import ReactHtmlParser from "html-react-parser";
import styles from "./PublicationsCard.module.css";
import { useEffect, useState } from "react";
import imgPlug from "../../assets/images/skillfactory.jpg"

const PublicationCard = (props) => {
  const { result } = props;
  const [imgSrc, setImgSrc] = useState(null);

  const content = result.data[0].ok.content.markup;

  // Изображения, где они есть
  useEffect(() => {
    const parsedMarkup = ReactHtmlParser(content);
    const Elements = parsedMarkup.props?.children;

    let stroke;
    if (typeof Elements[Elements.length - 1] === "string") {
      stroke = Elements[Elements.length - 1];
    }

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(stroke, "text/html");
    const doc = htmlDoc.querySelector("img");

    if (doc) {
      setImgSrc(doc.getAttribute("src"));
    }
  }, [content]);

  const date = new Date(result.data[0].ok.issueDate)
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join(".");
  const source = result.data[0].ok.source.name;
  const title = result.data[0].ok.title.text;
  const wordCount = result.data[0].ok.attributes.wordCount;
  const techNews = result.data[0].ok.attributes.isTechNews;
  const announcement = result.data[0].ok.attributes.isAnnouncement;
  const digest = result.data[0].ok.attributes.isDigest;

  // Очистка текста
  const sanitizeHtml = (htmlString) => {
    const sanitizedHTML = DOMPurify.sanitize(htmlString, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const decodedText = decodeEntities(sanitizedHTML);
    return decodedText.trim();
  }

  const decodeEntities = (text) => {
    const element = document.createElement('textarea');
    element.innerHTML = text;
    return element.value;
  }

  // Деление на параграфы
  const splitIntoParagraphs = (text) => {
    const paragraphs = text.split(/\s*\n\s*\n/);
    return paragraphs;
  }

  const cleanedHTML = sanitizeHtml(sanitizeHtml(content));
  const splitedText = splitIntoParagraphs(cleanedHTML);

  // Окончание слова "слово"
  const getWordEnding = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "ов";
    } else if (lastDigit === 1) {
      return "ова";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return "ова";
    } else {
      return "ов";
    }
  };

  return (
    <div className={styles.publicationCard}>
      <div className={styles.cardHead}>
        <span className={styles.date}>{date}</span>
        <a
          href={result.data[0].ok.url}
          target="_blank"
          rel="noreferrer"
          className={styles.source}
        >
          {source}
        </a>
      </div>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.tags}>
        {techNews && <p className={styles.tag}>Технические новости</p>}
        {announcement && <p className={styles.tag}>Анонсы и события</p>}
        {digest && <p className={styles.tag}>Сводки новостей</p>}
      </div>
      {imgSrc ? <img src={imgSrc} alt="publication-img" className={styles.image} /> : <img src={imgPlug} alt="publication-img" className={styles.image} />}
      <div className={styles.contentText} >{splitedText}</div>
      <div className={styles.cardFooter}>
        <button className={styles.sourceBtn} onClick={() => window.open(result.data[0].ok.url, "_blank")}>Читать в источнике</button>
        <span className={styles.wordCount}>{wordCount} сл{getWordEnding(wordCount)}</span>
      </div>
    </div>
  );
};

export default PublicationCard;
