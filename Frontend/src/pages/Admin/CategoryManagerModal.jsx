import React, { useState } from 'react';
import {
  FiX,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiLayers,
  FiSave,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../../services/categoryApi';

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  services,
  onCategoriesChanged,
  token,
}) {
  const [editingId, setEditingId] = useState(null); // null, 'new', or category ID
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingId('new');
    setFormData({
      name: '',
      tagline: '',
      order: categories.length,
      isActive: true,
    });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat._id || cat.id);
    setFormData({
      name: cat.name || '',
      tagline: cat.tagline || '',
      order: cat.order !== undefined ? cat.order : 0,
      isActive: cat.isActive !== false,
    });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setErrorMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    setLoading(true);
    try {
      if (editingId === 'new') {
        const res = await createCategoryApi(formData, token);
        if (res.success) {
          setSuccessMsg(`Category "${formData.name}" created! It now appears as a new column in the navbar.`);
          setEditingId(null);
          onCategoriesChanged();
        } else {
          setErrorMsg(res.message || 'Failed to create category.');
        }
      } else {
        const res = await updateCategoryApi(editingId, formData, token);
        if (res.success) {
          setSuccessMsg(`Category "${formData.name}" updated successfully.`);
          setEditingId(null);
          onCategoriesChanged();
        } else {
          setErrorMsg(res.message || 'Failed to update category.');
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat) => {
    const srvCount = services.filter((s) => s.category === cat.name).length;
    const confirmText = srvCount > 0
      ? `Category "${cat.name}" currently has ${srvCount} service(s) assigned to it. Are you sure you want to delete this category column from the navbar?`
      : `Are you sure you want to delete the category "${cat.name}"?`;

    if (!window.confirm(confirmText)) return;

    setLoading(true);
    try {
      const res = await deleteCategoryApi(cat._id || cat.id, token);
      if (res.success) {
        setSuccessMsg(`Category "${cat.name}" deleted.`);
        onCategoriesChanged();
      } else {
        setErrorMsg(res.message || 'Failed to delete category.');
      }
    } catch (err) {
      setErrorMsg('Failed to delete category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom animate-fade-in" style={{ zIndex: 1100 }}>
      <div
        className="modal-container-custom"
        style={{ maxWidth: '820px', width: '92%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header-custom" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 39, 138, 0.1), rgba(0, 203, 240, 0.2))',
                color: '#00278a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              <FiLayers />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#00278a', fontWeight: 800 }}>
                Service Categories & Navbar Columns
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Each category represents a column in the website's Services mega-menu. Creating a new category adds a column.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px' }}
          >
            <FiX style={{ fontSize: '1.4rem', color: '#64748b' }} />
          </button>
        </div>

        {/* Feedback Banners */}
        {errorMsg && (
          <div
            style={{
              padding: '12px 20px',
              background: '#fef2f2',
              color: '#b91c1c',
              borderBottom: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.86rem',
            }}
          >
            <FiAlertCircle /> <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div
            style={{
              padding: '12px 20px',
              background: '#f0fdf4',
              color: '#15803d',
              borderBottom: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.86rem',
            }}
          >
            <FiCheck /> <span>{successMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Top Actions Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
              Navbar Columns ({categories.length} Active Columns)
            </span>
            {editingId === null && (
              <button
                type="button"
                onClick={handleStartCreate}
                className="admin-submit-button"
                style={{
                  width: 'auto',
                  margin: 0,
                  padding: '8px 18px',
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FiPlus /> Add New Category Column
              </button>
            )}
          </div>

          {/* Add / Edit Form Drawer */}
          {editingId !== null && (
            <form
              onSubmit={handleSave}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 14px', color: '#00278a', fontSize: '1rem', fontWeight: 700 }}>
                {editingId === 'new' ? 'Create New Category Column' : 'Edit Category Column'}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Category Title * (Column Header)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. AI & Machine Learning"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Column Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Tagline / Column Description
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Custom AI agents, LLM integrations and automation."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                  }}
                />
                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                  Short description shown right below the category title in the navbar column.
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="table-btn"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="table-btn table-btn-primary"
                  style={{ padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FiSave /> {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          )}

          {/* Categories List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map((cat, idx) => {
              const catKey = cat._id || cat.id || cat.slug;
              const assignedServices = services.filter((s) => s.category === cat.name);

              return (
                <div
                  key={catKey}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 6px rgba(0, 39, 138, 0.03)',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: '#e0faff',
                        color: '#00278a',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#00278a' }}>
                          {cat.name}
                        </h4>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: assignedServices.length > 0 ? '#f0fdf4' : '#fef3c7',
                            color: assignedServices.length > 0 ? '#16a34a' : '#d97706',
                            fontWeight: 700,
                          }}
                        >
                          {assignedServices.length} {assignedServices.length === 1 ? 'service' : 'services'}
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                        {cat.tagline || 'No description provided'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(cat)}
                      className="table-btn"
                      title="Edit Category"
                      style={{ padding: '6px 10px', fontSize: '0.82rem' }}
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="table-btn"
                      title="Delete Category"
                      style={{ padding: '6px 10px', fontSize: '0.82rem', color: '#dc2626' }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Tip: Select category in any service's editor to assign it to that navbar column.
          </span>
          <button type="button" onClick={onClose} className="table-btn" style={{ padding: '8px 20px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

