import Axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PublicationsCard from "../PublicationCard/PublicationCard";
import styles from "./ListDocs.module.css";

const ListOfDocuments = (props) => {
  const { publications } = props;
  const token = useSelector((state) => state.token.value);

  const [encodedIds, SetEncodedIds] = useState([]);
  const [requestResults, setRequestResults] = useState([]);
  const [loadedPublications, setLoadedPublications] = useState(10);

  useEffect(() => {
    const ids = publications.data.items.map((item, index) => item.encodedId);
    SetEncodedIds(ids);
  }, []);

  const documentsRequest = async (encodedId) => {
    try {
      await Axios.post(
        "https://gateway.scan-interfax.ru/api/v1/documents",
        { ids: [encodedId] },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      ).then((res) =>
        setRequestResults((prevResults) => [...prevResults, res])
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const firstTenIds = encodedIds.slice(0, loadedPublications);
    firstTenIds.forEach((item) => {
      documentsRequest(item);
    });
  }, [encodedIds]);

  const loadMorePublications = () => {
    const remainingItems = encodedIds.slice(
      loadedPublications,
      loadedPublications + 10
    );
    remainingItems.forEach((item) => {
      documentsRequest(item);
    });
    setLoadedPublications((prevCount) => prevCount + 10);
  };

  return (
    <div className={styles.documents}>
      <div className={styles.documentsContainer}>
        {requestResults.map((result, index) => (
          <PublicationsCard key={index} result={result} />
        ))}
      </div>
      {encodedIds.length > loadedPublications && (
        <button
          className="universalBtn loadDocumentsBtn"
          onClick={loadMorePublications}
        >
          Показать больше
        </button>
      )}
    </div>
  );
};

export default ListOfDocuments;
