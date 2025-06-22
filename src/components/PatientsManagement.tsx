
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIRecommendations } from './AIRecommendations';
import { PatientsList } from './PatientsList';
import { Users, Brain } from 'lucide-react';

export function PatientsManagement() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pacientes</h1>
        <p className="text-gray-600">Administre pacientes internados y las recomendaciones de asignación de camas</p>
      </div>
      
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white shadow-sm border">
          <TabsTrigger 
            value="patients" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <Users className="w-4 h-4" />
            Pacientes Internados
          </TabsTrigger>
          <TabsTrigger 
            value="ai-recommendations"
            className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Brain className="w-4 h-4" />
            Recomendaciones IA
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-0">
          <PatientsList />
        </TabsContent>
        
        <TabsContent value="ai-recommendations" className="mt-0">
          <AIRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
