import React, { useState, useMemo } from 'react';
import { CameraEquipment, User, EquipmentCategory, EquipmentCategories } from '../../../types';
import { DashboardTemplate, InputField, ConfirmationModal } from '../../common/UI';
import { PlusIcon, EditIcon, DeleteIcon, CloseIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, BriefcaseIcon, ShieldIcon } from '../../common/Icons';

// --- PROPS INTERFACE ---
interface CameraEquipmentDashboardProps {
  equipment: CameraEquipment[];
  users: User[];
  onAdd: (item: Omit<CameraEquipment, 'id' | 'status' | 'checkedOutBy' | 'lastActionDate' | 'checkOutNotes'>) => void;
  onUpdate: (item: CameraEquipment) => void;
  onDelete: (id: string) => void;
  onCheckOut: (id: string, employeeName: string, checkOutNotes: string) => void;
  onCheckIn: (id: string, conditionNotes: string) => void;
}


// --- MODALS ---

const AddEditEquipmentModal: React.FC<{
    item: CameraEquipment | null;
    onClose: () => void;
    onSave: (data: any) => void;
}> = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        category: item?.category || 'Camera Body',
        serialNumber: item?.serialNumber || '',
        purchaseDate: item?.purchaseDate || '',
        notes: item?.notes || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item ? { ...item, ...formData } : formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="glass-card rounded-lg shadow-xl p-6 w-full max-w-lg border border-neutral-700">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">{item ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                    <button type="button" onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                <div className="space-y-4">
                    <InputField id="name" label="Equipment Name" placeholder="e.g., Canon EOS R5" value={formData.name} onChange={handleInputChange} />
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-neutral-300 mb-1.5">Category</label>
                        <select id="category" value={formData.category} onChange={handleInputChange} className="mt-1 shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500">
                            {EquipmentCategories.map(cat => <option key={cat} value={cat} className="bg-neutral-800 text-white">{cat}</option>)}
                        </select>
                    </div>
                    <InputField id="serialNumber" label="Serial Number" placeholder="Unique identifier" value={formData.serialNumber} onChange={handleInputChange} />
                    <InputField id="purchaseDate" label="Purchase Date" type="date" value={formData.purchaseDate} onChange={handleInputChange} required={false} />
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-neutral-300 mb-1.5">Notes</label>
                        <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" placeholder="Any specific details about this item..."/>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button type="button" onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors">Save Equipment</button>
                </div>
            </form>
        </div>
    );
};


const CheckOutModal: React.FC<{
    item: CameraEquipment;
    users: User[];
    onClose: () => void;
    onConfirm: (employeeName: string, checkOutNotes: string) => void;
}> = ({ item, users, onClose, onConfirm }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [checkOutNotes, setCheckOutNotes] = useState('');
    const availableEmployees = useMemo(() => users.filter(u => u.fullName && u.fullName.trim() !== ''), [users]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            onConfirm(selectedUser, checkOutNotes);
            onClose();
        } else {
            alert('Please select an employee.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="glass-card rounded-lg shadow-xl p-6 w-full max-w-lg border border-neutral-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Check Out Item</h2>
                    <button type="button" onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>
                 <p className="text-neutral-300 mb-6">Assign <span className="font-bold text-cyan-400">{item.name}</span> to an employee.</p>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="employee" className="block text-sm font-medium text-neutral-300 mb-1.5">Assign To</label>
                        <select id="employee" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required className="mt-1 shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500">
                            <option value="" disabled className="bg-neutral-800 text-neutral-500">Select an employee...</option>
                            {availableEmployees.map(user => <option key={user.username} value={user.fullName} className="bg-neutral-800 text-white">{user.fullName}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="checkOutNotes" className="block text-sm font-medium text-neutral-300 mb-1.5">Check-out Notes (Optional)</label>
                        <textarea id="checkOutNotes" rows={3} value={checkOutNotes} onChange={(e) => setCheckOutNotes(e.target.value)} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" placeholder="e.g., Included accessories, item condition..."/>
                    </div>
                </div>
                 <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button type="button" onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Confirm Check Out
                    </button>
                </div>
            </form>
        </div>
    );
};

const CheckInModal: React.FC<{
    item: CameraEquipment;
    onClose: () => void;
    onConfirm: (conditionNotes: string) => void;
}> = ({ item, onClose, onConfirm }) => {
    const [conditionNotes, setConditionNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(conditionNotes);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="glass-card rounded-lg shadow-xl p-6 w-full max-w-lg border border-neutral-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3"><ShieldIcon className="w-7 h-7 text-cyan-400" /> Verify & Check In Item</h2>
                    <button type="button" onClick={onClose} className="text-neutral-500 hover:text-white"><CloseIcon className="h-6 w-6"/></button>
                </div>

                <div className="space-y-4 my-6">
                    <div>
                        <p className="text-sm font-medium text-neutral-400">Item</p>
                        <p className="text-lg text-white font-semibold">{item.name}</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-neutral-400">Returned By</p>
                        <p className="text-md text-white">{item.checkedOutBy}</p>
                    </div>
                    {item.checkOutNotes && (
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Original Check-out Notes</p>
                            <p className="text-md text-neutral-300 bg-neutral-900/50 p-3 rounded-md mt-1 whitespace-pre-wrap">{item.checkOutNotes}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="conditionNotes" className="block text-sm font-medium text-neutral-300 mb-1.5">Condition on Return & Notes</label>
                        <textarea id="conditionNotes" required rows={4} value={conditionNotes} onChange={(e) => setConditionNotes(e.target.value)} className="shadow-sm bg-neutral-900/60 border border-neutral-700 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500" placeholder="Describe the condition of the item upon return..."/>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4 border-t border-neutral-700/60 pt-5">
                    <button type="button" onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Cancel</button>
                    <button type="submit" className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Complete Check-in
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- EQUIPMENT TABLE ---

const EquipmentTable: React.FC<{
    equipment: CameraEquipment[];
    onEdit: (item: CameraEquipment) => void;
    onDelete: (item: CameraEquipment) => void;
    onCheckOut: (item: CameraEquipment) => void;
    onCheckIn: (item: CameraEquipment) => void;
}> = ({ equipment, onEdit, onDelete, onCheckOut, onCheckIn }) => {
    return (
        <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-neutral-700/50">
                    <thead className="bg-neutral-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Item Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Serial No.</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Assigned To</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Last Activity</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                        {equipment.length === 0 ? (
                             <tr><td colSpan={6} className="text-center py-16 text-neutral-500"><div className="flex flex-col items-center gap-2"><BriefcaseIcon className="w-10 h-10" /><span>No equipment has been added yet.</span></div></td></tr>
                        ) : equipment.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-800/70 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{item.name}</div>
                                    <div className="text-sm text-neutral-400">{item.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{item.serialNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'In Stock' ? 'bg-green-900/60 text-green-300' : 'bg-yellow-900/60 text-yellow-300'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{item.checkedOutBy || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{item.lastActionDate ? new Date(item.lastActionDate).toLocaleString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-1">
                                        {item.status === 'In Stock' ? (
                                            <button onClick={() => onCheckOut(item)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Check Out"><ArrowUpTrayIcon className="w-5 h-5 text-neutral-400 group-hover:text-yellow-400"/></button>
                                        ) : (
                                            <button onClick={() => onCheckIn(item)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Verify & Check In"><ShieldIcon className="w-5 h-5 text-neutral-400 group-hover:text-green-400"/></button>
                                        )}
                                        <button onClick={() => onEdit(item)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Edit Item"><EditIcon className="w-5 h-5 text-neutral-400 group-hover:text-cyan-400"/></button>
                                        <button onClick={() => onDelete(item)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Delete Item"><DeleteIcon className="w-5 h-5 text-neutral-400 group-hover:text-red-500"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
export const CameraEquipmentDashboard: React.FC<CameraEquipmentDashboardProps> = ({ equipment, users, onAdd, onUpdate, onDelete, onCheckOut, onCheckIn }) => {
    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
    const [isCheckOutModalOpen, setCheckOutModalOpen] = useState(false);
    const [isCheckInModalOpen, setCheckInModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<CameraEquipment | null>(null);

    const handleOpenAddModal = () => {
        setSelectedEquipment(null);
        setAddEditModalOpen(true);
    };

    const handleOpenEditModal = (item: CameraEquipment) => {
        setSelectedEquipment(item);
        setAddEditModalOpen(true);
    };

    const handleOpenCheckOutModal = (item: CameraEquipment) => {
        setSelectedEquipment(item);
        setCheckOutModalOpen(true);
    };
    
    const handleOpenDeleteModal = (item: CameraEquipment) => {
        setSelectedEquipment(item);
        setDeleteModalOpen(true);
    };

    const handleOpenCheckInModal = (item: CameraEquipment) => {
        setSelectedEquipment(item);
        setCheckInModalOpen(true);
    };

    const handleCloseModals = () => {
        setAddEditModalOpen(false);
        setCheckOutModalOpen(false);
        setCheckInModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedEquipment(null);
    };

    const handleSaveEquipment = (formData: any) => {
        if (selectedEquipment) { // Editing existing item
            onUpdate(formData);
        } else { // Adding new item
            onAdd(formData);
        }
    };
    
    const handleConfirmCheckOut = (employeeName: string, checkOutNotes: string) => {
        if (selectedEquipment) {
            onCheckOut(selectedEquipment.id, employeeName, checkOutNotes);
            handleCloseModals();
        }
    };

    const handleConfirmCheckIn = (conditionNotes: string) => {
        if (selectedEquipment) {
            onCheckIn(selectedEquipment.id, conditionNotes);
            handleCloseModals();
        }
    };

    const handleDeleteItem = () => {
        if (selectedEquipment) {
            onDelete(selectedEquipment.id);
            handleCloseModals();
        }
    };
    
    return (
        <DashboardTemplate title="Camera Equipment Management">
            <div className="flex justify-between items-center mb-6 gap-4">
                <p className="text-neutral-400 max-w-3xl">
                    Track all company-owned camera gear. Check items in and out to maintain a record of who is using the equipment for photography or videography jobs.
                </p>
                <button 
                    onClick={handleOpenAddModal} 
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors whitespace-nowrap"
                >
                    <PlusIcon className="w-5 h-5"/>
                    Add Equipment
                </button>
            </div>

            <EquipmentTable
                equipment={equipment}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onCheckOut={handleOpenCheckOutModal}
                onCheckIn={handleOpenCheckInModal}
            />

            {isAddEditModalOpen && (
                <AddEditEquipmentModal
                    item={selectedEquipment}
                    onClose={handleCloseModals}
                    onSave={handleSaveEquipment}
                />
            )}
            {isCheckOutModalOpen && selectedEquipment && (
                <CheckOutModal
                    item={selectedEquipment}
                    users={users}
                    onClose={handleCloseModals}
                    onConfirm={handleConfirmCheckOut}
                />
            )}
            {isCheckInModalOpen && selectedEquipment && (
                <CheckInModal
                    item={selectedEquipment}
                    onClose={handleCloseModals}
                    onConfirm={handleConfirmCheckIn}
                />
            )}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleDeleteItem}
                title="Archive Equipment"
                message={<p>Are you sure you want to move <span className="font-bold text-white">{selectedEquipment?.name}</span> to the archive? It can be restored later.</p>}
                confirmText="Yes, Archive It"
                confirmButtonClass="bg-orange-600 hover:bg-orange-500"
            />
        </DashboardTemplate>
    );
};