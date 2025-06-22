
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Bed, Users, Clock } from 'lucide-react';

export function DashboardMetrics() {
  const { data: bedsData } = useQuery({
    queryKey: ['beds-summary'],
    queryFn: async () => {
      const { data: beds, error } = await supabase
        .from('cama')
        .select('estado');
      
      if (error) throw error;
      
      const total = beds.length;
      const occupied = beds.filter(bed => bed.estado === 'ocupada').length;
      const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
      
      return { total, occupied, occupancyRate };
    }
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients-waiting'],
    queryFn: async () => {
      const { data: internaciones, error } = await supabase
        .from('internacion')
        .select('grave, id_cama')
        .is('fecha_alta', null);
      
      if (error) throw error;
      
      const waiting = internaciones.filter(int => !int.id_cama).length;
      const critical = internaciones.filter(int => int.grave).length;
      
      return { waiting, critical };
    }
  });

  const metrics = [
    {
      title: 'Ocupación General',
      value: `${bedsData?.occupancyRate || 0}%`,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Camas',
      value: bedsData?.total || 0,
      subtitle: `${bedsData?.occupied || 0} ocupadas`,
      icon: Bed,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Pacientes Esperando',
      value: patientsData?.waiting || 0,
      subtitle: `${patientsData?.critical || 0} críticos`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tiempo Promedio',
      value: '24min',
      subtitle: 'Asignación de cama',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            {metric.subtitle && (
              <p className="text-sm text-gray-500">{metric.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
