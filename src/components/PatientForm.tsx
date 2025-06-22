
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalDataForm } from './forms/PersonalDataForm';
import { InternationDataForm } from './forms/InternationDataForm';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PatientData {
  nombre: string;
  apellido: string;
  DNI: string;
  edad: number;
  genero: string;
  obra_social: string;
}

interface InternationData {
  razon_ingreso: string;
  internacion_urgente: boolean;
  inmunocomprometido: boolean;
  oncologico: boolean;
  leucemia: boolean;
  internado_ultimos_30_dias: boolean;
  grave: boolean;
  fin_de_vida: boolean;
  sector_id: string;
}

export function PatientForm() {
  const [activeTab, setActiveTab] = useState('personal');
  const [patientData, setPatientData] = useState<PatientData>({
    nombre: '',
    apellido: '',
    DNI: '',
    edad: 0,
    genero: '',
    obra_social: ''
  });
  const [internationData, setInternationData] = useState<InternationData>({
    razon_ingreso: '',
    internacion_urgente: false,
    inmunocomprometido: false,
    oncologico: false,
    leucemia: false,
    internado_ultimos_30_dias: false,
    grave: false,
    fin_de_vida: false,
    sector_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePersonalDataComplete = (data: PatientData) => {
    setPatientData(data);
    setActiveTab('internation');
  };

  const handleSubmit = async (data: InternationData) => {
    setIsSubmitting(true);
    
    try {
      // Verificar si el paciente ya existe por DNI
      const { data: existingPatient } = await supabase
        .from('paciente')
        .select('id')
        .eq('DNI', patientData.DNI)
        .single();

      let patientId: string;

      if (existingPatient) {
        // El paciente ya existe, usar su ID
        patientId = existingPatient.id;
        toast({
          title: "Paciente existente",
          description: "Se encontró un paciente con este DNI. Se creará una nueva internación.",
        });
      } else {
        // Crear nuevo paciente
        const { data: newPatient, error: patientError } = await supabase
          .from('paciente')
          .insert([patientData])
          .select('id')
          .single();

        if (patientError) throw patientError;
        patientId = newPatient.id;
      }

      // Crear la internación SIN asignar cama
      const internationPayload = {
        id_paciente: patientId,
        razon_ingreso: data.razon_ingreso,
        fecha_ingreso: new Date().toISOString(),
        internacion_urgente: data.internacion_urgente,
        inmunocomprometido: data.inmunocomprometido,
        oncologico: data.oncologico,
        leucemia: data.leucemia,
        internado_ultimos_30_dias: data.internado_ultimos_30_dias,
        grave: data.grave,
        fin_de_vida: data.fin_de_vida,
        sector_id: data.sector_id,
        id_cama: null // No asignar cama automáticamente
      };

      const { error: internationError } = await supabase
        .from('internacion')
        .insert([internationPayload]);

      if (internationError) throw internationError;

      toast({
        title: "Paciente internado exitosamente",
        description: "El paciente ha sido agregado a la cola de internación sin asignación de cama",
      });

      // Resetear formulario
      setPatientData({
        nombre: '',
        apellido: '',
        DNI: '',
        edad: 0,
        genero: '',
        obra_social: ''
      });
      setInternationData({
        razon_ingreso: '',
        internacion_urgente: false,
        inmunocomprometido: false,
        oncologico: false,
        leucemia: false,
        internado_ultimos_30_dias: false,
        grave: false,
        fin_de_vida: false,
        sector_id: ''
      });
      setActiveTab('personal');

    } catch (error) {
      console.error('Error al internar paciente:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la internación. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Agregar Nuevo Paciente</CardTitle>
        <CardDescription>
          Complete los datos personales y clínicos para internar al paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Datos Personales</TabsTrigger>
            <TabsTrigger value="internation" disabled={!patientData.nombre}>
              Datos de Internación
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <PersonalDataForm 
              data={patientData}
              onComplete={handlePersonalDataComplete}
            />
          </TabsContent>
          
          <TabsContent value="internation" className="mt-6">
            <InternationDataForm 
              data={internationData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
