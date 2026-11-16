import { PersonIcon } from '@/src/shared/icons/PersonIcon';
import styles from './Header.module.scss';

type Props = {}
const Header = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.smallScreen}>
        <PersonIcon size={20} />
      </div>
      <div className={styles.largeScreen}>
        <p>Сегодня</p>
      </div>
    </div>
  )
}
export default Header