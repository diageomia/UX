import React, { useState, useEffect } from 'react';
import { User, Settings, Bookmark, Edit2, ChevronRight } from 'lucide-react';
import SavedPromptsModal from './SavedPromptsModal'; // To be created
import './UserProfile.css';

const UserProfile = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onUpdateProfile, 
  savedPrompts, 
  onRemovePrompt,
  modes,
  onModeChange
}) => {
  const [activeSection, setActiveSection] = useState(null);
  const [editForm, setEditForm] = useState({
    name: userProfile.name
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setActiveSection(null);
    }
  }, [isOpen]);



  const handleSave = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  const handleSectionToggle = (section) => {
    setActiveSection(prev => (prev === section ? null : section));
    if (section === 'editing') {
      setEditForm({ name: userProfile.name });
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: userProfile.name
    });
    setIsEditing(false);
    setActiveSection(null); // Close the section
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-dropdown">
      {/* User Info Section */}
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(userProfile.name)}
        </div>
        <div className="profile-info">
          <h3>{userProfile.name}</h3>
          <p>{userProfile.role}</p>
          <p className="profile-email">sarah.smith@diageo.com</p>
        </div>
      </div>

      <div className="profile-divider"></div>

      {/* Profile Actions */}
      <div className="profile-actions">
        <button 
          className="profile-action-item"
          onClick={() => handleSectionToggle('editing')}
        >
          <Edit2 size={16} />
          <span>Customize profile</span>
          <ChevronRight size={16} />
        </button>
        
        <button 
          className="profile-action-item"
          onClick={() => handleSectionToggle('prompts')}
        >
          <Bookmark size={16} />
          <span>Saved prompts ({savedPrompts.length})</span>
          <ChevronRight size={16} />
        </button>
        
        <button 
          className="profile-action-item"
          onClick={() => handleSectionToggle('settings')}
        >
          <Settings size={16} />
          <span>Settings</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Edit Profile Section */}
      {activeSection === 'editing' && (
        <>
          <div className="profile-divider"></div>
          <div className="profile-edit-section">
            <h4>Customize Profile</h4>
            <div className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              

              
              <div className="form-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <>
          <div className="profile-divider"></div>
          <div className="profile-settings-section">
            <h4>Settings</h4>
            <div className="mode-selection-section">
              <h5>Change Mode</h5>
              <div className="mode-options">
                {modes.map(mode => (
                  <div 
                    key={mode.id}
                    className={`mode-option ${userProfile.mode === mode.id ? 'active' : ''}`}
                    onClick={() => onModeChange(mode.id)}
                  >
                    <div className="mode-icon">{mode.icon}</div>
                    <div className="mode-content">
                      <h6 className="mode-name">{mode.name}</h6>
                      <p className="mode-description">{mode.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Saved Prompts Section */}
      {activeSection === 'prompts' && (
        <SavedPromptsModal 
          isOpen={true}
          onClose={() => handleSectionToggle('prompts')}
          savedPrompts={savedPrompts}
          onRemovePrompt={onRemovePrompt}
        />
      )}

      <div className="profile-divider"></div>
      
      {/* Sign Out */}
      <button className="profile-action-item signout-btn">
        <span>Sign out</span>
      </button>
    </div>
  );
};

export default UserProfile;
