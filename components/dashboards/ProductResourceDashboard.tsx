import React, { useState } from 'react';
import { Card, DashboardTemplate, PlaceholderContent } from '../common/UI';
import { BriefcaseIcon, UsersIcon, ChartIcon, CameraIcon as CameraTabIcon, ArchiveBoxIcon } from '../common/Icons';
import { CameraEquipmentDashboard, OurProductsDashboard, ArchiveDashboard } from './product-resource';
import { Products, CameraEquipment, User, Service } from '../../types';

interface ProductResourceDashboardProps {
  products: Products;
  onAddProduct: (category: keyof Products, serviceName: string) => void;
  onDeleteProduct: (category: keyof Products, serviceName: string) => void;
  // Camera Equipment props
  equipment: CameraEquipment[];
  users: User[];
  onAddEquipment: (item: Omit<CameraEquipment, 'id' | 'status'>) => void;
  onUpdateEquipment: (item: CameraEquipment) => void;
  onDeleteEquipment: (id: string) => void;
  onCheckOutEquipment: (id: string, employeeName: string, checkOutNotes: string) => void;
  onCheckInEquipment: (id: string, conditionNotes: string) => void;
  // Archive props
  archivedProducts: Products;
  archivedEquipment: CameraEquipment[];
  onRestoreProduct: (category: keyof Products, serviceName: string) => void;
  onPermanentDeleteProduct: (category: keyof Products, serviceName: string) => void;
  onRestoreEquipment: (id: string) => void;
  onPermanentDeleteEquipment: (id: string) => void;
}


export const ProductResourceDashboard: React.FC<ProductResourceDashboardProps> = (props) => {
    const { 
        products, onAddProduct, onDeleteProduct,
        equipment, users, onAddEquipment, onUpdateEquipment, onDeleteEquipment, onCheckOutEquipment, onCheckInEquipment,
        archivedProducts, archivedEquipment, onRestoreProduct, onPermanentDeleteProduct, onRestoreEquipment, onPermanentDeleteEquipment
    } = props;
    
    const [activeTab, setActiveTab] = useState('Camera Equipment');
    const tabs = ['Our Products', 'Camera Equipment', 'Archive'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Our Products':
                return <OurProductsDashboard products={products} onAddProduct={onAddProduct} onDeleteProduct={onDeleteProduct} />;
            case 'Camera Equipment':
                return <CameraEquipmentDashboard 
                    equipment={equipment} 
                    users={users}
                    onAdd={onAddEquipment}
                    onUpdate={onUpdateEquipment}
                    onDelete={onDeleteEquipment}
                    onCheckOut={onCheckOutEquipment}
                    onCheckIn={onCheckInEquipment}
                />;
            case 'Archive':
                return <ArchiveDashboard
                    archivedProducts={archivedProducts}
                    archivedEquipment={archivedEquipment}
                    onRestoreProduct={onRestoreProduct}
                    onPermanentDeleteProduct={onPermanentDeleteProduct}
                    onRestoreEquipment={onRestoreEquipment}
                    onPermanentDeleteEquipment={onPermanentDeleteEquipment}
                />;
            default:
                return null;
        }
    };
    
    return (
        <DashboardTemplate title="Product & Resource Management">
            <div className="border-b border-neutral-800">
                <nav className="flex space-x-2 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors focus:outline-none flex items-center gap-2 ${activeTab === tab ? 'bg-neutral-700/80 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                        >
                            {tab === 'Camera Equipment' && <CameraTabIcon className="w-5 h-5" />}
                            {tab === 'Our Products' && <BriefcaseIcon className="w-5 h-5" />}
                            {tab === 'Archive' && <ArchiveBoxIcon className="w-5 h-5" />}
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {renderContent()}
            </div>
        </DashboardTemplate>
    );
};