import styles from "./CardSlider.module.css";

const CardSlider = (props) => {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardContainer}>
          <img src={props.cardImg} alt="time-slider" className={styles.cardImg} />
          <p className={styles.cardTitle}>
            {props.title}
          </p>
        </div>
      </div>
    </>
  );
};

export default CardSlider;
