import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaImage,
  FaTerminal,
  FaEdit,
  FaUpload,
  FaFilePdf,
  FaTrash
} from 'react-icons/fa';
import { apiResponseHandler } from '../../utils/apiResponse';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const ProfileCRUD = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiResponseHandler('/profile/admin');
      if (response?.data?.success) {
        setProfile(response.data.data);
      } else {
        setError('Failed to load profile data');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await apiResponseHandler('/profile/admin', 'PUT', profile);
      if (response?.data?.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile save error:', error);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSocialLinks = (platform, value) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const updateTerminalCommand = (index, field, value) => {
    const updatedCommands = [...profile.terminalCommands];
    updatedCommands[index] = {
      ...updatedCommands[index],
      [field]: value
    };
    setProfile(prev => ({
      ...prev,
      terminalCommands: updatedCommands
    }));
  };

  const addTerminalCommand = () => {
    setProfile(prev => ({
      ...prev,
      terminalCommands: [
        ...prev.terminalCommands,
        { command: '', output: '', type: 'command' }
      ]
    }));
  };

  const removeTerminalCommand = (index) => {
    setProfile(prev => ({
      ...prev,
      terminalCommands: prev.terminalCommands.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await apiResponseHandler('/profile/admin/upload-image', 'POST', formData);

      if (response?.data?.success) {
        setProfile(prev => ({
          ...prev,
          profileImage: response.data.data.profileImageUrl
        }));
        setSuccess('Profile image uploaded successfully!');
        setProfileImageFile(null);
      } else {
        setError('Failed to upload profile image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload profile image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file size must be less than 10MB');
      return;
    }

    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await apiResponseHandler('/profile/admin/upload-resume', 'POST', formData);

      if (response?.data?.success) {
        setProfile(prev => ({
          ...prev,
          resumeUrl: response.data.data.resumeUrl
        }));
        setSuccess('Resume uploaded successfully!');
        setResumeFile(null);
      } else {
        setError('Failed to upload resume');
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      setError('Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const removeProfileImage = () => {
    setProfile(prev => ({
      ...prev,
      profileImage: ''
    }));
    setProfileImageFile(null);
  };

  const removeResume = () => {
    setProfile(prev => ({
      ...prev,
      resumeUrl: ''
    }));
    setResumeFile(null);
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchProfile} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Management</h1>
          <p className="text-gray-400">Update your personal information and settings</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSave />
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaUser className="text-cyan-400" />
            Basic Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={profile?.name || ''}
                onChange={(e) => updateProfile('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={profile?.title || ''}
                onChange={(e) => updateProfile('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Greeting</label>
              <input
                type="text"
                value={profile?.greeting || ''}
                onChange={(e) => updateProfile('greeting', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={profile?.description || ''}
                onChange={(e) => updateProfile('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                value={profile?.bio || ''}
                onChange={(e) => updateProfile('bio', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Extended Bio</label>
              <textarea
                value={profile?.bioExtended || ''}
                onChange={(e) => updateProfile('bioExtended', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
              <div className="space-y-3">
                {profile?.profileImage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Current profile image</p>
                    </div>
                    <button
                      onClick={removeProfileImage}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfileImageFile(e.target.files[0])}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <FaImage />
                    Choose Image
                  </label>
                  {profileImageFile && (
                    <>
                      <span className="text-sm text-gray-400">{profileImageFile.name}</span>
                      <button
                        onClick={() => handleImageUpload(profileImageFile)}
                        disabled={uploadingImage}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FaUpload />
                        {uploadingImage ? 'Uploading...' : 'Upload'}
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF)</label>
              <div className="space-y-3">
                {profile?.resumeUrl && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <FaFilePdf className="text-red-400 text-xl" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Current resume</p>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        View Resume
                      </a>
                    </div>
                    <button
                      onClick={removeResume}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <FaFilePdf />
                    Choose PDF
                  </label>
                  {resumeFile && (
                    <>
                      <span className="text-sm text-gray-400">{resumeFile.name}</span>
                      <button
                        onClick={() => handleResumeUpload(resumeFile)}
                        disabled={uploadingResume}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        <FaUpload />
                        {uploadingResume ? 'Uploading...' : 'Upload'}
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">Max file size: 10MB. PDF format only</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaEnvelope className="text-cyan-400" />
            Contact Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => updateProfile('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile?.phone || ''}
                onChange={(e) => updateProfile('phone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={profile?.location || ''}
                onChange={(e) => updateProfile('location', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image URL</label>
              <input
                type="url"
                value={profile?.profileImage || ''}
                onChange={(e) => updateProfile('profileImage', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Resume URL</label>
              <input
                type="url"
                value={profile?.resumeUrl || ''}
                onChange={(e) => updateProfile('resumeUrl', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <FaGithub className="text-cyan-400" />
          Social Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
            <input
              type="url"
              value={profile?.socialLinks?.github || ''}
              onChange={(e) => updateSocialLinks('github', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
            <input
              type="url"
              value={profile?.socialLinks?.linkedin || ''}
              onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
            <input
              type="url"
              value={profile?.socialLinks?.twitter || ''}
              onChange={(e) => updateSocialLinks('twitter', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCRUD;
