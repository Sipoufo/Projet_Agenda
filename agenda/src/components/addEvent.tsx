import React from 'react';
import closeIcon from '../images/x.svg'
import './modal.css'

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
    const outsideRef = React.useRef(null);
    const handleCloseOnOverlay = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.target === outsideRef.current) {
            onClose();
        }
    }

    return isOpen? (
        <div className={'modal'}>
            <div className={'modal__overlay'} ref={outsideRef} onClick={handleCloseOnOverlay}></div>
            <div className={'modal__box'}>
                <button className={'modal__close-btn'} onClick={onClose}>
                    <img src={closeIcon} alt={'close modal'} />
                </button>
                <div className={'modal__title'}>
                    {title}
                </div>
                <div className={'modal__content'}>
                    {children}
                </div>
            </div>
        </div>
    ): null;
};