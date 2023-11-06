import { useSelector } from "react-redux";
import Search from "../../components/Search/Search";
import Results from "../../components/Results/Results";
import styles from "./SearchPage.module.css";
import { useState } from "react";

const SearchPage = () => {
  const [formData, setFormData] = useState(null);
  const histograms = useSelector((state) => state.histograms.value);
  const publications = useSelector((state) => state.publications.value);

  return (
    <>
      <section className={styles.search}>
        {(histograms && publications) || formData ? (
          <Results formData={formData} />
        ) : (
          <Search setFormData={setFormData} />
        )}
      </section>
    </>
  );
};

export default SearchPage;
