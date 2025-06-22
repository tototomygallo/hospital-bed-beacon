
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SectorStatus() {
  const { data: sectorsData } = useQuery({
    queryKey: ['sectors-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sector')
        .select(`
          id,
          nombre,
          cama (
            id,
            estado
          )
        `);
      
      if (error) throw error;
      
      return data.map(sector => {
        const beds = sector.cama || [];
        const total = beds.length;
        const occupied = beds.filter((bed: any) => bed.estado === 'ocupada').length;
        const free = beds.filter((bed: any) => bed.estado === 'libre').length;
        const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
        
        return {
          id: sector.id,
          name: sector.nombre,
          total,
          occupied,
          free,
          occupancyRate
        };
      });
    }
  });

  const sectorColors = [
    { bg: 'bg-red-500', light: 'bg-red-100' },
    { bg: 'bg-blue-500', light: 'bg-blue-100' },
    { bg: 'bg-green-500', light: 'bg-green-100' },
    { bg: 'bg-purple-500', light: 'bg-purple-100' }
  ];

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Estado de Sectores
          </CardTitle>
          <p className="text-gray-600">Vista general de la ocupación por sector</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectorsData?.map((sector, index) => {
              const colors = sectorColors[index % sectorColors.length];
              return (
                <div key={sector.id} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                    <h3 className="font-semibold text-gray-900">{sector.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ocupación:</span>
                      <span className="font-semibold">{sector.occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors.bg} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${sector.occupancyRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{sector.occupied} ocupadas</span>
                      <span>{sector.free} libres</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
