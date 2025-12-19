import { type JSX } from "react";
import { Modal } from "react-bootstrap";

type AppModalProperty = {
    show: boolean,
    onHide: () => void,
    headerText?: string,
    children: JSX.Element
}


function AppModal({show, onHide, children, headerText}: AppModalProperty) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{headerText ?? ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
}

export default AppModal;