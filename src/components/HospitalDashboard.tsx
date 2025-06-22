
import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { SectorStatus } from './dashboard/SectorStatus';
import { DashboardNavigation } from './dashboard/DashboardNavigation';
import { PatientsManagement } from './PatientsManagement';

export function HospitalDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardMetrics />
        <SectorStatus />
        <div className="mt-8">
          <PatientsManagement />
        </div>
        <DashboardNavigation />
      </div>
    </div>
  );
}
