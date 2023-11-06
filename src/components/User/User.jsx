import styles from "./User.module.css";

const User = (props) => {
  const { handleLogout, isMenuOpen, setIsMenuOpen } = props;
  
  const handleClose = () => {
    handleLogout();
    if (isMenuOpen) {
      setIsMenuOpen(!isMenuOpen);
    }
  }
  
  return (
    <>
      <div className={styles.userInfo}>
        <p className={styles.userName}>Алексей А.</p>
        <button className={styles.logOut} onClick={handleClose}>
          Выйти
        </button>
      </div>
      <div className={styles.userPhoto} />
    </>
  );
};

export default User;
