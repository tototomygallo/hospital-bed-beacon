
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users, Bed, Activity, Calendar, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PatientForm } from '../PatientForm';

export function DashboardNavigation() {
  const modules = [
    {
      title: 'Agregar Paciente',
      description: 'Internar nuevo paciente',
      icon: UserPlus,
      color: 'bg-green-500',
      action: 'form'
    },
    {
      title: 'Gestión de Pacientes',
      description: 'Ver y editar pacientes',
      icon: Users,
      color: 'bg-blue-500',
      action: 'patients'
    },
    {
      title: 'Administrar Camas',
      description: 'Gestionar estado de camas',
      icon: Bed,
      color: 'bg-purple-500',
      action: 'beds'
    },
    {
      title: 'Reportes',
      description: 'Estadísticas y reportes',
      icon: Activity,
      color: 'bg-orange-500',
      action: 'reports'
    },
    {
      title: 'Planificación',
      description: 'Agenda y turnos',
      icon: Calendar,
      color: 'bg-pink-500',
      action: 'planning'
    },
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: Settings,
      color: 'bg-gray-500',
      action: 'settings'
    }
  ];

  const handleModuleClick = (action: string) => {
    if (action !== 'form') {
      console.log(`Módulo ${action} próximamente disponible`);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Módulos del Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {module.action === 'form' ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      Abrir
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <PatientForm />
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleModuleClick(module.action)}
                >
                  Próximamente
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
