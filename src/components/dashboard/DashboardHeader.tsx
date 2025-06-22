
import React from 'react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CEMIC - Las Heras</h1>
            </div>
            <p className="text-gray-600">Bienvenido, Dr. García</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Administración
          </Button>
        </div>
      </div>
    </header>
  );
}
