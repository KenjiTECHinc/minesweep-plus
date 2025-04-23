type FooterProps = {
    level: string;
    openModal: () => void;
    startNewGame: () => void;
}

const Footer = (props: FooterProps) => {
    const { level, openModal, startNewGame } = props;
    return (
        <div className="footer-bar">
            <div className="footer-buttons">
                {level === "custom" && <button onClick={openModal}>Edit Board</button>}
                <button className="footer-button" onClick={startNewGame}>New Game</button>
            </div>
        </div>
    )
}

export default Footer;