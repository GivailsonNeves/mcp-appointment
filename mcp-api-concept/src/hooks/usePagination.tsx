import { useState } from "react";

export function usePagination({initialPage = 1, initialPageSize = 10}) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const onPageSizeChange = (size: number) => {
        setPageSize(size);
    }
    
    return {
        currentPage,
        pageSize,
        nextPage,
        prevPage,
        onPageChange: setCurrentPage,
        onPageSizeChange,
    };
}