import { ReactComponent as Logo } from '@assets/luxe.svg';
import localStyles from './index.module.scss';

const Home = () => {
    return (
        <div className={localStyles.home}>
            <section>
                <Logo/>
                <div className={localStyles.textContainer}>
                    <h4>
                        Welcome to your luxe.js project!
                    </h4>
                </div>
            </section>
        </div>
    );
};

export default Home;
