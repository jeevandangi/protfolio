import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCode, FaChartBar,
  FaEye, FaEyeSlash, FaReact, FaJs, FaNodeJs, FaPython, FaDatabase,
  FaHtml5, FaCss3Alt, FaGitAlt, FaDocker, FaAws, FaVuejs, FaAngular,
  FaBootstrap, FaSass, FaPhp, FaJava, FaServer, FaMobile, FaDesktop,
  FaTools
} from 'react-icons/fa';
import { SiMongodb, SiTypescript, SiNextdotjs } from 'react-icons/si';
import { apiResponseHandler } from '../../utils/apiResponse';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const SkillsCRUD = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 50,
    icon: '',
    color: 'text-blue-400',
    order: 1,
    isActive: true
  });

  const categories = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Other'];
  const colors = [
    'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-red-400',
    'text-purple-400', 'text-cyan-400', 'text-pink-400', 'text-orange-400'
  ];

  const iconMap = {
    FaReact, FaJs, FaNodeJs, FaPython, FaDatabase, FaHtml5, FaCss3Alt,
    FaGitAlt, FaDocker, FaAws, FaVuejs, FaAngular, FaBootstrap, FaSass,
    FaPhp, FaJava, FaServer, FaMobile, FaDesktop, FaTools,
    SiMongodb, SiTypescript, SiNextdotjs, FaCode
  };

  const renderIcon = (iconName, className = '') => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) {
      console.warn(`Icon not found: ${iconName}`);
    }
    return (IconComponent || FaCode)({ className });
  };

  const resetNewSkill = () => {
    setNewSkill({
      name: '', category: '', level: 50, icon: '',
      color: 'text-blue-400', order: 1, isActive: true
    });
  };

  const validateSkill = (skill) => {
    if (!skill.name || !skill.category || !skill.icon) {
      setError('Skill name, category, and icon are required.');
      return false;
    }
    if (!iconMap[skill.icon]) {
      setError(`Icon "${skill.icon}" is not supported.`);
      return false;
    }
    return true;
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiResponseHandler('/skills/admin');
      const result = data.data.data;

      if (result.skills && Array.isArray(result.skills)) {
        setSkills(
          result.skills.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
        );
      } else {
        setError('No skills found or invalid format.');
        setSkills([]);
      }
    } catch (err) {
      console.error('Skills fetch error:', err);
      setError('Error connecting to server. Try again later.');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSaveSkill = async (skillData) => {
    if (!validateSkill(skillData)) return;
    try {
      const res = await apiResponseHandler('/skills/admin', 'POST', skillData);
      if (res?.data?.success) {
        await fetchSkills();
        setShowAddForm(false);
        resetNewSkill();
      } else {
        setError(res?.data?.message || 'Failed to create skill');
      }
    } catch (err) {
      console.error('Skill save error:', err);
      setError('Server error while saving skill');
    }
  };

  const handleUpdateSkill = async (skillId, skillData) => {
    if (!validateSkill(skillData)) return;
    try {
      const response = await apiResponseHandler(`/skills/admin/${skillId}`, 'PUT', skillData);
      if (response?.data?.success) {
        await fetchSkills();
        setEditingSkill(null);
      } else {
        setError('Failed to update skill');
      }
    } catch (error) {
      console.error('Skill update error:', error);
      setError('Failed to update skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      const response = await apiResponseHandler(`/skills/admin/${skillId}`, 'DELETE');
      if (response?.data?.success) {
        await fetchSkills();
      } else {
        setError('Failed to delete skill');
      }
    } catch (error) {
      console.error('Skill delete error:', error);
      setError('Failed to delete skill');
    }
  };

  const toggleSkillStatus = async (skillId) => {
    try {
      const response = await apiResponseHandler(`/skills/admin/${skillId}/toggle`, 'PATCH');
      if (response?.data?.success) {
        await fetchSkills();
      } else {
        setError('Failed to toggle skill status');
      }
    } catch (error) {
      console.error('Skill toggle error:', error);
      setError('Failed to toggle skill status');
    }
  };

  if (loading) return <LoadingSpinner message="Loading skills..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchSkills} />;

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Skills Management</h2>
          <p className="text-gray-400">Manage and organize your skills</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          <FaPlus /> Add Skill
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-800 p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold">Add Skill</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            />
            <input
              type="text"
              placeholder="Icon (e.g., FaReact)"
              value={newSkill.icon}
              onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
            <input
              type="number"
              min="1"
              max="100"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            />
            <select
              value={newSkill.color}
              onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              {colors.map(color => (
                <option key={color} value={color}>{color.replace('text-', '').replace('-400', '')}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleSaveSkill(newSkill)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={() => { setShowAddForm(false); resetNewSkill(); }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {skills.map(skill => (
          <div key={skill._id} className={`bg-gray-800 p-6 rounded-xl relative ${!skill.isActive && 'opacity-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-3 items-center">
                {renderIcon(skill.icon, `text-2xl ${skill.color}`)}
                <div>
                  <h3 className="font-bold">{skill.name}</h3>
                  <p className="text-sm text-gray-400">{skill.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleSkillStatus(skill._id)} className="text-white"><FaEye /></button>
                <button onClick={() => setEditingSkill(skill)} className="text-blue-400"><FaEdit /></button>
                <button onClick={() => handleDeleteSkill(skill._id)} className="text-red-400"><FaTrash /></button>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Level</span>
                <span>{skill.level}%</span>
              </div>
              <div className="bg-gray-700 h-2 rounded-full">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsCRUD;
