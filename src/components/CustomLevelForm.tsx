import { useState } from "react";
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for accessibility

interface CustomLevelFormProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSubmit: (settings: { rows: number; cols: number; mines: number }) => void;
}

const CustomLevelForm: React.FC<CustomLevelFormProps> = ({ isOpen, onRequestClose, onSubmit }) => {
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);
    const [mines, setMines] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ rows, cols, mines });
        onRequestClose(); // Close the modal after submission
    };

    return (
        <Modal className="custom-modal" isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Custom Game Settings">
            <h2>Customize Game</h2>
            <form onSubmit={handleSubmit} onAbort={onRequestClose}>
                <div className="modal-column">
                    <div className="modal-row">
                        <label className="modal-label">
                            Rows
                            <input
                                className="modal-input"
                                type="number"
                                value={rows}
                                onChange={(e) => setRows(Number(e.target.value))}
                                min={2}
                                max={40}
                            />
                        </label>
                        <label className="modal-label">
                            Columns
                            <input
                                className="modal-input"
                                type="number"
                                value={cols}
                                onChange={(e) => setCols(Number(e.target.value))}
                                min={2}
                                max={40}
                            />
                        </label>
                        <label className="modal-label">
                            Mines
                            <input
                                className="modal-input"
                                type="number"
                                value={mines}
                                onChange={(e) => setMines(Number(e.target.value))}
                                min={1}
                                max={rows * cols - 1}
                            />
                        </label>
                    </div>
                    <div className="modal-row">
                        <button type="button" onClick={onRequestClose}>Cancel</button>
                        <button type="submit">Start Game</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CustomLevelForm;