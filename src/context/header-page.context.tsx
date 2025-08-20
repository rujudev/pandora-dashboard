import {
    createContext,
    FC,
    PropsWithChildren,
    ReactNode,
    useState
} from "react";

export interface HeaderPageContextProps {
    title?: string | ReactNode;
    description?: string | ReactNode;
    backButton?: ReactNode;
    rightContent?: ReactNode;
    isLoadingPage?: boolean;
}

interface HeaderPageContextType {
    headerConfig: HeaderPageContextProps;
    setHeaderConfig: React.Dispatch<React.SetStateAction<HeaderPageContextProps>>;
}

export const initHeaderPage: HeaderPageContextProps = {
    title: '',
    description: '',
    backButton: null,
    rightContent: null,
    isLoadingPage: true,
};

export const HeaderPageContext = createContext<HeaderPageContextType | undefined>(undefined);

export const HeaderPageProvider: FC<PropsWithChildren> = ({ children }) => {
    const [headerConfig, setHeaderConfig] = useState<HeaderPageContextProps>(initHeaderPage);

    return (
        <HeaderPageContext
            value={{
                headerConfig,
                setHeaderConfig
            }}>
            {children}
        </HeaderPageContext>
    );
};
