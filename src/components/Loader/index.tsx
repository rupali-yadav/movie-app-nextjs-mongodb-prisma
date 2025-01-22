import s from './Loader.module.css';

const Loader = () => {
    return (
        <div className={s.loaderContainer}>
            <div className='flex justify-center align-middle'>
                <div className={s.loader}>
                    <span className={s.loader_text}>loading</span>
                    <span className={s.load}></span>
                </div>
            </div>
        </div>
    );
}

export default Loader;