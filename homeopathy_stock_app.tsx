import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Edit2, Trash2, PlusCircle, AlertTriangle, Package, Bell, Scan } from 'lucide-react';

const HomeopathyStockManager = () => {
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Arnica Montana', potency: '200', company: 'SBL', category: 'Dilutions', stock: 25, lowStockThreshold: 10, barcode: '8901231234567' },
    { id: 2, name: 'Belladonna', potency: '30', company: 'Dr. Reckeweg', category: 'Dilutions', stock: 8, lowStockThreshold: 10, barcode: '8901231234568' },
    { id: 3, name: 'Calendula', potency: '1M', company: 'Hahnemann', category: 'Dilutions', stock: 15, lowStockThreshold: 10, barcode: '8901231234569' },
    { id: 4, name: 'Calcarea Phos', potency: '6X', company: 'SBL', category: 'Biochemics', stock: 5, lowStockThreshold: 10, barcode: '8901231234570' },
    { id: 5, name: 'Ferrum Phos', potency: '12X', company: 'Dr. Reckeweg', category: 'Biochemics', stock: 12, lowStockThreshold: 10, barcode: '8901231234571' },
    { id: 6, name: 'Natrum Mur', potency: '200', company: 'Schwabe', category: 'Dilutions', stock: 20, lowStockThreshold: 10, barcode: '8901231234572' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    potency: '',
    company: '',
    category: 'Dilutions',
    stock: 0,
    lowStockThreshold: 10,
    barcode: ''
  });

  const categories = ['All', 'Dilutions', 'Biochemics', 'Mother Tinctures', 'Tablets', 'Ointments'];

  const lowStockMedicines = medicines.filter(med => med.stock <= med.lowStockThreshold);

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.potency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const updateStock = (id, change) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, stock: Math.max(0, med.stock + change) } : med
    ));
  };

  const deleteMedicine = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.potency || !newMedicine.company || !newMedicine.barcode) {
      alert('Please fill in all required fields including barcode!');
      return;
    }

    // Check if barcode already exists
    if (medicines.some(med => med.barcode === newMedicine.barcode)) {
      alert('This barcode already exists! Please use a different barcode.');
      return;
    }

    const medicine = {
      ...newMedicine,
      id: Date.now(),
      stock: parseInt(newMedicine.stock) || 0
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine({
      name: '',
      potency: '',
      company: '',
      category: 'Dilutions',
      stock: 0,
      lowStockThreshold: 10,
      barcode: ''
    });
    setShowAddForm(false);
  };

  const handleBarcodeInput = (e) => {
    if (e.key === 'Enter') {
      processBarcodeInput();
    }
  };

  const processBarcodeInput = () => {
    if (!scannedBarcode.trim()) {
      alert('Please enter or scan a barcode!');
      return;
    }

    const medicine = medicines.find(med => med.barcode === scannedBarcode.trim());
    
    if (medicine) {
      // Medicine found - increase stock by 1
      setMedicines(medicines.map(med => 
        med.barcode === scannedBarcode.trim() 
          ? { ...med, stock: med.stock + 1 } 
          : med
      ));
      setScanResult({
        success: true,
        message: `✅ Stock Updated! ${medicine.name} (${medicine.potency}) - ${medicine.company}`,
        oldStock: medicine.stock,
        newStock: medicine.stock + 1,
        category: medicine.category
      });
    } else {
      setScanResult({
        success: false,
        message: '❌ Medicine not found! Please add this medicine first.',
        barcode: scannedBarcode.trim()
      });
    }
    
    setScannedBarcode('');
    
    // Clear result after 5 seconds
    setTimeout(() => {
      setScanResult(null);
    }, 5000);
  };

  const startEdit = (med) => {
    setEditingId(med.id);
  };

  const saveEdit = (id, field, value) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const finishEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="w-10 h-10 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Prakash Homeo Hall</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBarcodeScanner(!showBarcodeScanner)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Scan className="w-5 h-5" />
                Barcode Scanner
              </button>
              <button
                onClick={() => setShowLowStock(!showLowStock)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                Low Stock
                {lowStockMedicines.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {lowStockMedicines.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by medicine name, company, or potency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Low Stock Alert Panel */}
        {showLowStock && lowStockMedicines.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-800">Low Stock Medicines</h2>
            </div>
            <div className="grid gap-3">
              {lowStockMedicines.map(med => (
                <div key={med.id} className="bg-white p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-800">{med.name}</span>
                    <span className="text-gray-600 ml-2">({med.potency})</span>
                  </div>
                  <span className="text-red-600 font-bold">Only {med.stock} left!</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barcode Scanner Section */}
        {showBarcodeScanner && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Scan className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-800">Barcode Scanner</h2>
            </div>
            <p className="text-gray-700 mb-4">
              📦 Scan or enter the barcode to automatically update stock. Each scan adds 1 unit to inventory.
            </p>
            
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={scannedBarcode}
                  onChange={(e) => setScannedBarcode(e.target.value)}
                  onKeyPress={handleBarcodeInput}
                  placeholder="Scan barcode or type here and press Enter..."
                  className="w-full p-4 pr-12 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  autoFocus
                />
                <Scan className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
              </div>
              <button
                onClick={processBarcodeInput}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Process
              </button>
            </div>

            {scanResult && (
              <div className={`p-4 rounded-xl ${
                scanResult.success 
                  ? 'bg-green-100 border-2 border-green-400' 
                  : 'bg-red-100 border-2 border-red-400'
              }`}>
                <p className={`font-bold text-lg mb-2 ${
                  scanResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {scanResult.message}
                </p>
                {scanResult.success && (
                  <div className="text-gray-700">
                    <p>📂 Category: <span className="font-semibold">{scanResult.category}</span></p>
                    <p>📊 Stock: <span className="font-semibold">{scanResult.oldStock}</span> → <span className="font-bold text-green-600">{scanResult.newStock}</span></p>
                  </div>
                )}
                {!scanResult.success && scanResult.barcode && (
                  <p className="text-red-700 mt-2">
                    Barcode: <span className="font-mono font-semibold">{scanResult.barcode}</span>
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">💡 How it works:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Scan the barcode or manually enter it</li>
                <li>• System automatically identifies the medicine and category</li>
                <li>• Stock increases by 1 unit per scan</li>
                <li>• If medicine not found, you'll be notified to add it first</li>
              </ul>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add Medicine Button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg mb-6 hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-6 h-6" />
          {showAddForm ? 'Cancel' : 'Add New Medicine'}
        </button>

        {/* Add Medicine Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Medicine</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name *</label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., Arnica Montana"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Potency *</label>
                <input
                  type="text"
                  value={newMedicine.potency}
                  onChange={(e) => setNewMedicine({...newMedicine, potency: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., 200, 30, 1M"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={newMedicine.company}
                  onChange={(e) => setNewMedicine({...newMedicine, company: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., SBL, Dr. Reckeweg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={newMedicine.category}
                  onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
                <input
                  type="number"
                  value={newMedicine.stock}
                  onChange={(e) => setNewMedicine({...newMedicine, stock: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert (when stock falls below)</label>
                <input
                  type="number"
                  value={newMedicine.lowStockThreshold}
                  onChange={(e) => setNewMedicine({...newMedicine, lowStockThreshold: parseInt(e.target.value)})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Barcode *</label>
                <input
                  type="text"
                  value={newMedicine.barcode}
                  onChange={(e) => setNewMedicine({...newMedicine, barcode: e.target.value})}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="e.g., 8901231234567"
                />
              </div>
            </div>
            <button
              onClick={addMedicine}
              className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
            >
              Add Medicine
            </button>
          </div>
        )}

        {/* Medicine List */}
        <div className="grid gap-4">
          {filteredMedicines.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">No medicines found</p>
            </div>
          ) : (
            filteredMedicines.map(med => (
              <div
                key={med.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl ${
                  med.stock <= med.lowStockThreshold ? 'border-2 border-red-300' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    {editingId === med.id ? (
                      <div className="grid md:grid-cols-3 gap-3 mb-3">
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => saveEdit(med.id, 'name', e.target.value)}
                          className="p-2 border-2 border-blue-300 rounded-lg"
                          placeholder="Medicine name"
                        />
                        <input
                          type="text"
                          value={med.potency}
                          onChange={(e) => saveEdit(med.id, 'potency', e.target.value)}
                          className="p-2 border-2 border-blue-300 rounded-lg"
                          placeholder="Potency"
                        />
                        <input
                          type="text"
                          value={med.company}
                          onChange={(e) => saveEdit(med.id, 'company', e.target.value)}
                          className="p-2 border-2 border-blue-300 rounded-lg"
                          placeholder="Company"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{med.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                            Potency: {med.potency}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                            {med.company}
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {med.category}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Stock Display */}
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Total Stock</div>
                      {editingId === med.id ? (
                        <input
                          type="number"
                          value={med.stock}
                          onChange={(e) => saveEdit(med.id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-20 p-2 border-2 border-blue-300 rounded-lg text-center text-2xl font-bold"
                        />
                      ) : (
                        <div className={`text-3xl font-bold ${
                          med.stock <= med.lowStockThreshold ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {med.stock}
                        </div>
                      )}
                    </div>

                    {/* Stock Control Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStock(med.id, -1)}
                        className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
                        title="Decrease stock"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateStock(med.id, 1)}
                        className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                        title="Increase stock"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateStock(med.id, 10)}
                        className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-bold"
                        title="Add 10 (bulk order)"
                      >
                        +10
                      </button>
                    </div>

                    {/* Edit/Delete Buttons */}
                    <div className="flex gap-2">
                      {editingId === med.id ? (
                        <button
                          onClick={finishEdit}
                          className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(med)}
                          className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition-colors"
                          title="Edit medicine"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMedicine(med.id)}
                        className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                        title="Delete medicine"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {med.stock <= med.lowStockThreshold && (
                  <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-medium">Low Stock Alert! Please reorder soon.</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeopathyStockManager;