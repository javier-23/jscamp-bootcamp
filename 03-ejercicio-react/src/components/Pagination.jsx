export function Pagination({currentPage = 1, totalPages, onPageChange}) {

    const pages = Array.from({length: totalPages}, (_, i) => i + 1)

    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    const stylePrevButton = isFirstPage ? {pointerEvents: 'none', opacity: '0.5'} : {}
    const styleNextButton = isLastPage ? {pointerEvents: 'none', opacity: '0.5'} : {}

    const handlePrevClick = (e) => {
        e.preventDefault()
        if(isFirstPage === false){
            onPageChange(currentPage - 1)
        }
    }

    const handleNextClick = (e) => {
        e.preventDefault()
        if(isLastPage === false) {
            onPageChange(currentPage + 1)
        }
    }

    const handleChangePage = (e, page) => {
        e.preventDefault()
        onPageChange(page)
    }

    return (
        <nav className="paginacion" aria-label="Paginación de resultados de búsqueda">
            <button onClick={handlePrevClick} title="Ir a la página anterior" aria-label="Ir a la página anterior" style={stylePrevButton}>
                <svg className="pagination-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>

            </button>
            
            {pages.map(page => (
                <button
                    key={page}
                    href="#"
                    className={page === currentPage ? 'is-active' : ''}
                    onClick={(event) => handleChangePage(event, page)}
                >
                    {page}
                </button>
            ))}

            <button onClick={handleNextClick} title="Ir a la página siguiente" aria-label="Ir a la página siguiente" style={styleNextButton}>
                <svg className="pagination-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>
            </button>
        </nav>
    )
}