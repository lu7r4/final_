import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import { logout, removeToken } from "../../store";
import Logo from "../../assets/images/scan-header-logo.svg";
import LogoWhite from "../../assets/images/scan-footer-logo.svg";
import Close from "../../assets/images/close-menu.svg";
import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import User from "../User/User";
import AuthorizationsButtons from "../AuthButton/AuthButton";

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1320);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const authorized = useSelector((state) => state.isUserLogged.value);
  const token = useSelector((state) => state.token.value);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1320);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data, isLoading } = useQuery(
    ["accountInfo"],
    async () => {
      return await Axios.get(
        "https://gateway.scan-interfax.ru/api/v1/account/info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.data);
    },
    { enabled: token ? true : false }
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expire");
    localStorage.removeItem("formData");
    localStorage.removeItem("histograms");
    localStorage.removeItem("publications");
    dispatch(logout(false));
    dispatch(removeToken(null));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className="wrapper header-footer-content">
        <div className={styles.links}>
          <img src={Logo} alt="header-logo" />
          {!isMobile && <Navbar />}
        </div>
        <div
          className={styles.authorizationButtons}
          style={{ display: authorized ? "none" : isMobile ? "none" : "flex" }}
        >
          <AuthorizationsButtons />
        </div>
        <div
          className={styles.limits}
          style={{ display: !authorized ? "none" : "flex" }}
        >
          <span
            className={styles.loader}
            style={{ display: isLoading ? "flex" : "none" }}
          ></span>
          <div
            className={styles.accInfoContainer}
            style={{
              display: isLoading ? "none" : "block",
            }}
          >
            <span className={styles.accountInfo}>
              <p className={styles.limit}>Использовано компаний</p>
              <p className={styles.companiesUsed}>
                {data?.eventFiltersInfo.usedCompanyCount}
              </p>
            </span>
            <span className={styles.accountInfo}>
              <p className={styles.limit}>Лимит по компаниям</p>
              <p className={styles.companyLimit}>
                {data?.eventFiltersInfo.companyLimit}
              </p>
            </span>
          </div>
        </div>
        <div
          className={styles.authorizedUser}
          style={{
            display: !authorized
              ? "none"
              : authorized && isMobile
              ? "none"
              : "flex",
          }}
        >
          <User handleLogout={handleLogout} />
        </div>
        <div className={styles.burgerMenu} onClick={toggleMenu}>
          <hr className={styles.burderLine} />
          <hr className={styles.burderLine} />
          <hr className={styles.burderLine} />
        </div>
        {isMenuOpen && (
          <div className={styles.menu}>
            <div className={styles.menuContainer}>
              <div className={styles.menuHead}>
                <img src={LogoWhite} alt="white-logo" />
                <img
                  src={Close}
                  alt="close-menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
              </div>
                <Navbar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
                {authorized && <User handleLogout={handleLogout} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />}
                {!authorized && <AuthorizationsButtons setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
