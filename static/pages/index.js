import SignUp from '@/components/SignUp';
import styles from './signin.module.scss';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.signup}>
        <SignUp />
      </div>
    </div>
  );
}
