import React, { useState } from 'react';
import { DashboardTemplate, ConfirmationModal } from '../../common/UI';
import { Products, Service } from '../../../types';
import { CloseIcon, BriefcaseIcon, CameraIcon, CodeIcon, SpeakerPhoneIcon } from '../../common/Icons';

interface ProductAdderProps {
    onAdd: (name: string) => void;
}

const ProductAdder: React.FC<ProductAdderProps> = ({ onAdd }) => {
    const [name, setName] = useState('');

    const handleAddClick = () => {
        if (name.trim()) {
            onAdd(name.trim());
            setName('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddClick();
        }
    };

    return (
        <div className="flex gap-2 mt-4 border-t border-neutral-700/50 pt-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="New service name..."
                className="flex-grow shadow-sm bg-neutral-900/60 border border-neutral-700 placeholder-neutral-500 text-white block w-full sm:text-sm rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
            />
            <button
                onClick={handleAddClick}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-md transition-colors"
            >
                Add
            </button>
        </div>
    );
};

interface ProductCategoryCardProps {
    title: string;
    categoryKey: keyof Products;
    services: Service[];
    onAddProduct: (category: keyof Products, name: string) => void;
    onDeleteProduct: (category: keyof Products, name: string) => void;
    icon: React.ReactNode;
}

const ProductCategoryCard: React.FC<ProductCategoryCardProps> = ({ title, categoryKey, services, onAddProduct, onDeleteProduct, icon }) => {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    const openDeleteModal = (service: Service) => {
        setServiceToDelete(service);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setServiceToDelete(null);
        setDeleteModalOpen(false);
    };

    const confirmDelete = () => {
        if (serviceToDelete) {
            onDeleteProduct(categoryKey, serviceToDelete.name);
        }
        closeDeleteModal();
    };

    return (
        <>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Archive Service"
                message={<p>Are you sure you want to move the service <span className="font-bold text-white">{serviceToDelete?.name}</span> to the archive? You can restore it later.</p>}
                confirmText="Yes, Archive It"
                confirmButtonClass="bg-orange-600 hover:bg-orange-500"
            />
            <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-lg shadow-lg flex flex-col">
                <div className="p-5 border-b border-neutral-700/50 flex items-center gap-4">
                    <div className="bg-neutral-800 p-3 rounded-lg text-cyan-400">{icon}</div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <p className="text-sm text-neutral-400">{services.length} services</p>
                    </div>
                </div>
                <div className="p-5 flex-grow overflow-y-auto max-h-72">
                    <ul className="space-y-2">
                        {services.map(service => (
                            <li key={service.name} className="flex justify-between items-center bg-neutral-800/70 p-2.5 rounded-md text-sm group">
                                <span className="text-neutral-200">{service.name}</span>
                                <button
                                    onClick={() => openDeleteModal(service)}
                                    className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title={`Delete ${service.name}`}
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                        {services.length === 0 && (
                            <li className="text-center text-neutral-500 italic py-4">No services listed.</li>
                        )}
                    </ul>
                </div>
                <div className="p-5 mt-auto">
                     <ProductAdder onAdd={(name) => onAddProduct(categoryKey, name)} />
                </div>
            </div>
        </>
    );
};


interface OurProductsDashboardProps {
    products: Products;
    onAddProduct: (category: keyof Products, name: string) => void;
    onDeleteProduct: (category: keyof Products, name: string) => void;
}

export const OurProductsDashboard: React.FC<OurProductsDashboardProps> = ({ products, onAddProduct, onDeleteProduct }) => {
    const productCategories = [
        { key: 'graphicDesign', title: 'Graphic Design', icon: <BriefcaseIcon className="w-6 h-6" /> },
        { key: 'videoProduction', title: 'Video Production', icon: <CameraIcon className="w-6 h-6" /> },
        { key: 'photography', title: 'Photography', icon: <CameraIcon className="w-6 h-6" /> },
        { key: 'digitalMarketing', title: 'Digital Media Marketing', icon: <SpeakerPhoneIcon className="w-6 h-6" /> },
    ];
    
    return (
        <DashboardTemplate title="Our Products">
            <p className="text-neutral-400 mb-6 max-w-3xl">Manage the services offered by the company. These services will be available when creating new jobs in the Marketing and Admin dashboards.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {productCategories.map(cat => (
                    <ProductCategoryCard
                        key={cat.key}
                        title={cat.title}
                        categoryKey={cat.key as keyof Products}
                        services={products[cat.key as keyof Products]}
                        onAddProduct={onAddProduct}
                        onDeleteProduct={onDeleteProduct}
                        icon={cat.icon}
                    />
                ))}
            </div>
        </DashboardTemplate>
    );
};