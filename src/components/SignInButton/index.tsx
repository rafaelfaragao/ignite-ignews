import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
  const isUserLoggedIn = true; //variavel para trocar a cor do button SignIn

  return isUserLoggedIn ? (
    <button 
      type="button"
      className={styles.SignInButton}
    >
      <FaGithub color="#04D361"/>
      Rafael Aragão
      <FiX color="#737380" className={styles.closeIcon}/>
    </button>
  ) : (
    <button 
      type="button"
      className={styles.SignInButton}
    >
      <FaGithub color="#EBDA17"/>
      Sign in with Github
    </button>
  );
}