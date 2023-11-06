import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = (props) => {
  const {isMenuOpen, setIsMenuOpen} = props;
  
  const handleMenuClose = () => {
    if (isMenuOpen) {
      setIsMenuOpen(!isMenuOpen)
    }
  }
  
  return (
    <>
      <ul className={styles.navbar}>
        <li className={styles.navbar__item}>
          <Link to="/" className={styles.navbar__link} onClick={handleMenuClose}>
            Главная
          </Link>
        </li>
        <li className={styles.navbar__item}>
          <Link to="*" className={styles.navbar__link} onClick={handleMenuClose}>
            Тарифы
          </Link>
        </li>
        <li className={styles.navbar__item}>
          <Link to="*" className={styles.navbar__link} onClick={handleMenuClose}>
            FAQ
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Navbar;
