import styles from './Spinner.module.css';

export function Spinner(){
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinner} aria-label="Cargando trabajos"></div>
            <p className={styles.spinnerText}>
                Cargando trabajos...
            </p> 
        </div>
    )
}