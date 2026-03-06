import React, { useState, useEffect, useContext } from 'react';
import { X, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const SavedAddresses = ({ isOpen, onClose }) => {
  const { backendUrl, token } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (isOpen && token) {
      fetchAddresses();
    }
  }, [isOpen, token]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/address/list`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingAddress ? '/api/address/update' : '/api/address/add';
      const payload = editingAddress 
        ? { ...formData, addressId: editingAddress._id }
        : formData;

      const res = await axios.post(
        `${backendUrl}${endpoint}`,
        payload,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(editingAddress ? 'Address updated!' : 'Address added!');
        fetchAddresses();
        resetForm();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state || '',
      zipcode: address.zipcode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Delete this address?')) return;
    
    try {
      const res = await axios.post(
        `${backendUrl}/api/address/delete`,
        { addressId },
        { headers: { token } }
      );
      
      if (res.data.success) {
        toast.success('Address deleted');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const setDefault = async (addressId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/address/set-default`,
        { addressId },
        { headers: { token } }
      );
      
      if (res.data.success) {
        toast.success('Default address updated');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to set default');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-light tracking-wide">Saved Addresses</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showAddForm ? (
            <>
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-black transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-black mb-6"
              >
                <Plus size={20} />
                <span>Add New Address</span>
              </button>

              {addresses.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No saved addresses yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border-2 rounded-lg p-4 ${
                        address.isDefault ? 'border-black bg-gray-50' : 'border-gray-200'
                      }`}
                    >
                      {address.isDefault && (
                        <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded mb-2">
                          DEFAULT
                        </span>
                      )}
                      <div className="space-y-1 text-sm mb-4">
                        <p className="font-semibold text-gray-900">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-gray-600">{address.street}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} {address.zipcode}
                        </p>
                        <p className="text-gray-600">{address.country}</p>
                        <p className="text-gray-600">{address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefault(address._id)}
                            className="flex-1 text-xs border border-gray-300 px-3 py-2 rounded hover:bg-gray-50"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex-1 text-xs border border-gray-300 px-3 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="text-xs border border-red-300 text-red-600 px-3 py-2 rounded hover:bg-red-50 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-medium mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="border border-gray-300 rounded-md py-2 px-4"
                />
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="border border-gray-300 rounded-md py-2 px-4"
                />
              </div>

              <input
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md py-2 px-4"
              />

              <input
                required
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full border border-gray-300 rounded-md py-2 px-4"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border border-gray-300 rounded-md py-2 px-4"
                />
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="border border-gray-300 rounded-md py-2 px-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="Zipcode"
                  className="border border-gray-300 rounded-md py-2 px-4"
                />
                <input
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="border border-gray-300 rounded-md py-2 px-4"
                />
              </div>

              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border border-gray-300 rounded-md py-2 px-4"
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm">Set as default address</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 py-3 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-md hover:bg-gray-800"
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAddresses;