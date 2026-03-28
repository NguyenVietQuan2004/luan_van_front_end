// // hooks/useTableFilter.ts
// import { useState, useEffect } from "react";

// export function useTableFilter(tableName: string = "default") {
//   const storageKey = `table_filter_${tableName}`;

//   const [globalFilter, setGlobalFilter] = useState<string>(() => {
//     if (typeof window === "undefined") return "";
//     return localStorage.getItem(storageKey) || "";
//   });

//   // Lưu vào localStorage khi filter thay đổi
//   useEffect(() => {
//     localStorage.setItem(storageKey, globalFilter);
//   }, [globalFilter, storageKey]);

//   // Xóa filter (nếu cần)
//   const clearFilter = () => setGlobalFilter("");

//   return {
//     globalFilter,
//     setGlobalFilter,
//     clearFilter,
//   };
// }

import { useState, useEffect, useCallback } from "react";

export function useTableFilter(tableName: string = "default") {
  const storageKey = `table_filter_${tableName}`;

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(storageKey) || "";
  });

  // Debounce lưu vào localStorage
  const saveToStorage = useCallback(
    (value: string) => {
      localStorage.setItem(storageKey, value);
    },
    [storageKey],
  );

  // Lưu với debounce 400ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(globalFilter);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [globalFilter, saveToStorage]);

  const clearFilter = () => setGlobalFilter("");

  return {
    globalFilter,
    setGlobalFilter,
    clearFilter,
  };
}
