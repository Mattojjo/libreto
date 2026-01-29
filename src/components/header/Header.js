import React, { useState } from 'react';
import AddNoteModal from './AddNoteModal';
import './Header.css';

const Header = ({ onNoteAdded }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <header className="header">
                <h1 className="header-title">Libreto</h1>
                <div className="header-menu">
                    <button
                        className="header-add-btn"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Add new note"
                        title="Add new note"
                    >
                        <span className="plus-icon">+</span>
                    </button>
                </div>
            </header>
            <AddNoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onNoteAdded={onNoteAdded}
            />
        </>
    );
};

export default Header;
