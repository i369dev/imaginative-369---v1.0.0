import React, { useState } from 'react';
import { Products, CameraEquipment, Service } from '../../../types';
import { DashboardTemplate, ConfirmationModal, ArchivedItemDetailsModal } from '../../common/UI';
import { ArrowUturnLeftIcon, DeleteIcon, InformationCircleIcon } from '../../common/Icons';

interface ArchiveDashboardProps {
  archivedProducts: Products;
  archivedEquipment: CameraEquipment[];
  onRestoreProduct: (category: keyof Products, serviceName: string) => void;
  onPermanentDeleteProduct: (category: keyof Products, serviceName: string) => void;
  onRestoreEquipment: (id: string) => void;
  onPermanentDeleteEquipment: (id: string) => void;
}

export const ArchiveDashboard: React.FC<ArchiveDashboardProps> = ({ 
    archivedProducts, 
    archivedEquipment, 
    onRestoreProduct, 
    onPermanentDeleteProduct, 
    onRestoreEquipment, 
    onPermanentDeleteEquipment 
}) => {
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);
    const [confirmMessage, setConfirmMessage] = useState<React.ReactNode>('');
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [itemToView, setItemToView] = useState<Service & { category: keyof Products } | CameraEquipment | null>(null);

    const handlePermanentDeleteClick = (deleteFn: () => void, message: React.ReactNode) => {
        setConfirmMessage(message);
        setActionToConfirm(() => deleteFn);
        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        if (actionToConfirm) {
            actionToConfirm();
        }
        setConfirmOpen(false);
        setActionToConfirm(null);
    };

    const handleViewDetails = (item: Service & { category: keyof Products } | CameraEquipment) => {
        setItemToView(item);
        setDetailsModalOpen(true);
    };

    const allArchivedServices = Object.entries(archivedProducts).flatMap(([category, services]) => 
        services.map(service => ({ ...service, category: category as keyof Products }))
    );

    const getCategoryTitle = (key: string) => {
        const titles: {[key: string]: string} = {
            graphicDesign: 'Graphic Design',
            videoProduction: 'Video Production',
            photography: 'Photography',
            digitalMarketing: 'Digital Marketing'
        };
        return titles[key] || key;
    }

    return (
        <DashboardTemplate title="Archive">
            {isDetailsModalOpen && <ArchivedItemDetailsModal item={itemToView} onClose={() => setDetailsModalOpen(false)} />}
            <ConfirmationModal 
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                title="Permanent Deletion"
                message={confirmMessage}
                confirmText="Yes, Delete Permanently"
            />
            <p className="text-neutral-400 mb-6 max-w-3xl">
                This is the archive for deleted items. You can restore items to make them active again, or delete them permanently. Permanent deletion cannot be undone.
            </p>

            <div className="space-y-8">
                {/* Archived Services Table */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Archived Services</h3>
                     <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
                        <div className="overflow-x-auto rounded-lg">
                            <table className="min-w-full divide-y divide-neutral-700/50">
                                <thead className="bg-neutral-800/60">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Service Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date Archived</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Archived By</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/80">
                                    {allArchivedServices.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-8 text-neutral-500">No services have been archived.</td></tr>
                                    ) : (
                                        allArchivedServices.map(service => (
                                            <tr key={`${service.category}-${service.name}`} className="hover:bg-neutral-800/70 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{service.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{getCategoryTitle(service.category)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{service.archivedDate ? new Date(service.archivedDate).toLocaleString() : 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{service.archivedBy || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <button onClick={() => handleViewDetails(service)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="View Details"><InformationCircleIcon className="w-5 h-5 text-neutral-400 group-hover:text-cyan-400"/></button>
                                                        <button onClick={() => onRestoreProduct(service.category, service.name)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Restore"><ArrowUturnLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-green-400"/></button>
                                                        <button onClick={() => handlePermanentDeleteClick(() => onPermanentDeleteProduct(service.category, service.name), <p>Permanently delete service <span className="font-bold text-white">{service.name}</span>?</p>)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Delete Permanently"><DeleteIcon className="w-5 h-5 text-neutral-400 group-hover:text-red-500"/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                 {/* Archived Equipment Table */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Archived Equipment</h3>
                     <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg">
                        <div className="overflow-x-auto rounded-lg">
                             <table className="min-w-full divide-y divide-neutral-700/50">
                                <thead className="bg-neutral-800/60">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Equipment Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Serial No.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date Archived</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Archived By</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/80">
                                    {archivedEquipment.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-8 text-neutral-500">No equipment has been archived.</td></tr>
                                    ) : (
                                        archivedEquipment.map(item => (
                                            <tr key={item.id} className="hover:bg-neutral-800/70 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{item.category}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{item.serialNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{item.archivedDate ? new Date(item.archivedDate).toLocaleString() : 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{item.archivedBy || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-1">
                                                        <button onClick={() => handleViewDetails(item)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="View Details"><InformationCircleIcon className="w-5 h-5 text-neutral-400 group-hover:text-cyan-400"/></button>
                                                        <button onClick={() => onRestoreEquipment(item.id)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Restore"><ArrowUturnLeftIcon className="w-5 h-5 text-neutral-400 group-hover:text-green-400"/></button>
                                                        <button onClick={() => handlePermanentDeleteClick(() => onPermanentDeleteEquipment(item.id), <p>Permanently delete equipment <span className="font-bold text-white">{item.name}</span>?</p>)} className="p-2 rounded-full hover:bg-neutral-700 transition-colors group" title="Delete Permanently"><DeleteIcon className="w-5 h-5 text-neutral-400 group-hover:text-red-500"/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardTemplate>
    );
};