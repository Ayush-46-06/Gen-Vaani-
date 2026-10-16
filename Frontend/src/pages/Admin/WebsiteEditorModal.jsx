import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUploadCloud, FiCheck, FiAlertCircle, FiGlobe, FiTag, FiLink, FiImage, FiLoader } from 'react-icons/fi';
import { uploadToImageKitApi, createPortfolioWebsiteApi, updatePortfolioWebsiteApi } from '../../services/portfolioApi';
import './WebsiteEditorModal.css';

export default function WebsiteEditorModal({ isOpen, onClose, website, onSaved, adminToken }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tallImageUrl, setTallImageUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Upload States
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (website) {
      setTitle(website.title || '');
      setCategory(website.category || 'Web Application');
      setLiveUrl(website.liveUrl || '');
      setImageUrl(website.image || '');
      setTallImageUrl(website.tallImage || website.image || '');
      setOrder(website.order !== undefined ? website.order : 0);
      setIsActive(website.isActive !== undefined ? website.isActive : true);
      setUploadSuccess(Boolean(website.image || website.tallImage));
    } else {
      setTitle('');
      setCategory('Web Application');
      setLiveUrl('');
      setImageUrl('');
      setTallImageUrl('');
      setOrder(0);
      setIsActive(true);
      setUploadSuccess(false);
    }
    setUploadError('');
    setSubmitError('');
  }, [website, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      // Read as base64 Data URL
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        const res = await uploadToImageKitApi(base64Data, file.name, adminToken);

        if (res && res.success && res.url) {
          setImageUrl(res.url);
          setTallImageUrl(res.url);
          setUploadSuccess(true);
        } else {
          setUploadError(res?.message || 'Failed to upload image to ImageKit.');
        }
        setUploading(false);
      };

      reader.onerror = () => {
        setUploadError('Failed to read file.');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error', err);
      setUploadError('An error occurred while uploading.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setSubmitError('Website title / name is required.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      title: title.trim(),
      category: category.trim() || 'Web Application',
      liveUrl: liveUrl.trim(),
      image: imageUrl.trim(),
      tallImage: tallImageUrl.trim() || imageUrl.trim(),
      order: Number(order) || 0,
      isActive: Boolean(isActive),
    };

    try {
      let res;
      if (website && (website._id || website.id)) {
        const id = website._id || website.id;
        res = await updatePortfolioWebsiteApi(id, payload, adminToken);
      } else {
        res = await createPortfolioWebsiteApi(payload, adminToken);
      }

      if (res && res.success) {
        onSaved && onSaved(res.website);
        onClose();
      } else {
        setSubmitError(res?.message || 'Failed to save website.');
      }
    } catch (err) {
      console.error('Submit error', err);
      setSubmitError('Failed to communicate with server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="website-modal-overlay" onClick={onClose}>
      <div className="website-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="website-modal-header">
          <div className="header-left">
            <span className="header-icon-box">
              <FiGlobe />
            </span>
            <div>
              <h2 className="modal-heading">
                {website ? 'Edit Portfolio Website' : 'Add New Portfolio Website'}
              </h2>
              <p className="modal-subheading">
                Upload screenshot to ImageKit and publish to public portfolio
              </p>
            </div>
          </div>
          <button type="button" className="close-x-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="website-modal-form">
          {submitError && (
            <div className="modal-alert error">
              <FiAlertCircle />
              <span>{submitError}</span>
            </div>
          )}

          <div className="form-grid">
            {/* Website Name */}
            <div className="form-group span-2">
              <label htmlFor="website-title">
                <FiGlobe className="field-icon" /> Website Name / Title <span className="req">*</span>
              </label>
              <input
                id="website-title"
                type="text"
                placeholder="e.g. Confy Sportware"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="website-category">
                <FiTag className="field-icon" /> Category / Industry
              </label>
              <input
                id="website-category"
                type="text"
                placeholder="e.g. E-Commerce, Sports Management"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Live Website URL */}
            <div className="form-group">
              <label htmlFor="website-live-url">
                <FiLink className="field-icon" /> Live Website URL
              </label>
              <input
                id="website-live-url"
                type="url"
                placeholder="https://confysportware.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>

            {/* Display Order */}
            <div className="form-group">
              <label htmlFor="website-order">Display Sequence / Order</label>
              <input
                id="website-order"
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>

            {/* Status Toggle */}
            <div className="form-group status-group">
              <label>Visibility Status</label>
              <label className="toggle-switch-label">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="toggle-switch-slider"></span>
                <span className="toggle-text">{isActive ? 'Live on Portfolio' : 'Hidden Draft'}</span>
              </label>
            </div>

            {/* ImageKit Upload Area */}
            <div className="form-group span-2">
              <label>
                <FiImage className="field-icon" /> Website Screenshot (ImageKit Hosted)
              </label>

              <div
                className={`imagekit-dropzone ${uploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileSelect}
                />

                {uploading ? (
                  <div className="dropzone-status">
                    <FiLoader className="spin-icon" />
                    <span>Uploading screenshot to ImageKit...</span>
                  </div>
                ) : uploadSuccess && (imageUrl || tallImageUrl) ? (
                  <div className="dropzone-preview-container">
                    <div className="image-preview-box">
                      <img src={imageUrl || tallImageUrl} alt="Uploaded preview" />
                    </div>
                    <div className="image-info-box">
                      <div className="badge-hosted">
                        <FiCheck /> Hosted on ImageKit
                      </div>
                      <p className="image-url-preview">{imageUrl || tallImageUrl}</p>
                      <button
                        type="button"
                        className="btn-change-image"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone-empty">
                    <FiUploadCloud className="upload-icon" />
                    <p className="upload-main-text">Click or drag full website screenshot here</p>
                    <p className="upload-hint-text">
                      Supports PNG, JPG, WebP. Automatically stored & optimized on ImageKit CDN.
                    </p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="field-error">
                  <FiAlertCircle /> {uploadError}
                </div>
              )}

              {/* Direct Image URL input as alternative */}
              <div className="manual-url-row">
                <span>Or paste direct image URL:</span>
                <input
                  type="url"
                  placeholder="https://ik.imagekit.io/vtfcbjo5c/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setTallImageUrl(e.target.value);
                    if (e.target.value) setUploadSuccess(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="website-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={submitting || uploading}>
              {submitting ? (
                <>
                  <FiLoader className="spin-icon" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{website ? 'Update Website' : 'Publish Website'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
