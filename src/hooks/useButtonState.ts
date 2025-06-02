import { useContext } from 'react';
import { ButtonStateContext } from '../context/button-state.context';

const useButtonState = () => {
    const context = useContext(ButtonStateContext)

    if (!context) throw new Error('El hook useButtonState no está siendo usado dentro de un ButtonStateProvider');

    return context;
}

export default useButtonState