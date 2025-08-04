import React from 'react';
import { X, Bookmark, Trash2 } from 'lucide-react';
import './SavedPromptsModal.css';

const SavedPromptsModal = ({ isOpen, onClose, savedPrompts, onRemovePrompt }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Bookmark size={20} />
            <span>Saved Prompts</span>
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {savedPrompts.length === 0 ? (
            <div className="no-prompts-message">
              <Bookmark size={48} />
              <h4>No Saved Prompts</h4>
              <p>You haven't saved any prompts yet. Bookmark a response to save the prompt.</p>
            </div>
          ) : (
            <ul className="prompts-list">
              {savedPrompts.map((prompt) => (
                <li key={prompt.id} className="prompt-list-item">
                  <p className="prompt-list-text">{prompt.text}</p>
                  <div className="prompt-list-actions">
                    <span className="prompt-list-date">
                      {new Date(prompt.savedAt).toLocaleDateString()}
                    </span>
                    <button 
                      className="remove-prompt-list-btn"
                      onClick={() => onRemovePrompt(prompt.id)}
                      title="Remove prompt"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPromptsModal;
