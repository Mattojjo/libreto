import React, { useState } from 'react';
import { Plus, CheckSquare, Square, X, Trash2 } from 'lucide-react';
import AddNoteModal from './AddNoteModal';
import './Header.css';

const Header = ({ onNoteAdded, bulkMode, toggleBulkMode, selectAll, deleteSelected, selectedCount, totalNotes }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <header className="header">
                <h1 className="header-title">Libreto</h1>
                <div className="header-menu">
                    <button
                        className="header-bulk-btn"
                        onClick={toggleBulkMode}
                        title={bulkMode ? 'Cancel selection' : 'Select multiple'}
                    >
                        {bulkMode ? <X size={20} /> : <CheckSquare size={20} />}
                    </button>
                    {bulkMode && (
                        <>
                            <button
                                className="header-select-all-btn"
                                onClick={selectAll}
                                title={selectedCount === totalNotes ? 'Deselect all' : 'Select all'}
                            >
                                {selectedCount === totalNotes ? <Square size={20} /> : <CheckSquare size={20} />}
                            </button>
                            <button
                                className="header-delete-btn"
                                onClick={deleteSelected}
                                disabled={selectedCount === 0}
                                title={`Delete ${selectedCount} selected`}
                            >
                                <Trash2 size={18} />
                                {selectedCount > 0 && <span style={{ marginLeft: '4px' }}>({selectedCount})</span>}
                            </button>
                        </>
                    )}
                    <button
                        className="header-add-btn"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Add new note"
                        title="Add new note"
                    >
                        <Plus size={24} strokeWidth={2.5} />
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
