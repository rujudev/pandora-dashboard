import React, { createContext, FC, useContext, useState } from "react";

export type Crumb = {
    label: React.ReactNode;
    path?: string;
    isLast?: boolean;
};

export interface BreadcrumbsContextType {
    crumbs: Crumb[];
    setCrumbs: (c: Crumb[]) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextType | undefined>(undefined);

export const BreadcrumbsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [crumbs, setCrumbsState] = useState<Crumb[]>([]);

    const setCrumbs = (c: Crumb[]) => {
        // marcar el último como isLast = true
        if (c.length > 0) {
            const mapped = c.map((cr, i) => ({ ...cr, isLast: i === c.length - 1 }));
            console.log('setCrumbs', mapped);
            setCrumbsState(mapped);
        } else {
            setCrumbsState([]);
        }
    };

    return (
        <BreadcrumbsContext.Provider value={{
            crumbs,
            setCrumbs,
        }}>
            {children}
        </BreadcrumbsContext.Provider>
    );
};

export const useBreadcrumbs = (): BreadcrumbsContextType => {
    const ctx = useContext(BreadcrumbsContext);
    if (!ctx) throw new Error("useBreadcrumbs debe usarse dentro de BreadcrumbsProvider");
    return ctx;
};