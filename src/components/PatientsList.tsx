
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Clock, AlertTriangle } from 'lucide-react';

interface PatientInternation {
  id: string;
  razon_ingreso: string;
  fecha_ingreso: string;
  internacion_urgente: boolean;
  grave: boolean;
  fin_de_vida: boolean;
  oncologico: boolean;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    DNI: string;
    edad: number;
    genero: string;
    obra_social: string;
  };
  sector: {
    nombre: string;
  };
  cama: {
    identificador: string;
  } | null;
}

export function PatientsList() {
  const [patients, setPatients] = useState<PatientInternation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('internacion')
        .select(`
          id,
          razon_ingreso,
          fecha_ingreso,
          internacion_urgente,
          grave,
          fin_de_vida,
          oncologico,
          paciente:id_paciente (
            id,
            nombre,
            apellido,
            DNI,
            edad,
            genero,
            obra_social
          ),
          sector:sector_id (
            nombre
          ),
          cama:id_cama (
            identificador
          )
        `)
        .is('fecha_alta', null)
        .order('fecha_ingreso', { ascending: false });

      if (error) throw error;
      
      // Filtrar y mapear los datos correctamente
      const validPatients = (data || [])
        .filter(patient => patient.paciente) // Solo incluir pacientes válidos
        .map(patient => ({
          id: patient.id,
          razon_ingreso: patient.razon_ingreso,
          fecha_ingreso: patient.fecha_ingreso,
          internacion_urgente: patient.internacion_urgente,
          grave: patient.grave,
          fin_de_vida: patient.fin_de_vida,
          oncologico: patient.oncologico,
          paciente: patient.paciente,
          sector: patient.sector || { nombre: 'Sin sector' },
          cama: patient.cama
        }));

      setPatients(validPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pacientes internados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (patient: PatientInternation) => {
    if (patient.fin_de_vida) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Fin de Vida</Badge>;
    }
    if (patient.grave) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Grave</Badge>;
    }
    if (patient.internacion_urgente) {
      return <Badge className="bg-orange-500 hover:bg-orange-600 gap-1"><Clock className="w-3 h-3" />Urgente</Badge>;
    }
    if (patient.oncologico) {
      return <Badge className="bg-purple-500 hover:bg-purple-600 gap-1">Oncológico</Badge>;
    }
    return <Badge variant="secondary" className="gap-1">Estable</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-blue-900">Pacientes Internados</CardTitle>
          </div>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <CardTitle className="text-blue-900">Pacientes Internados</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          Lista de pacientes actualmente internados ({patients.length} pacientes)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Paciente</TableHead>
                <TableHead className="font-semibold text-gray-700">DNI</TableHead>
                <TableHead className="font-semibold text-gray-700">Edad</TableHead>
                <TableHead className="font-semibold text-gray-700">Sector</TableHead>
                <TableHead className="font-semibold text-gray-700">Cama</TableHead>
                <TableHead className="font-semibold text-gray-700">Razón de Ingreso</TableHead>
                <TableHead className="font-semibold text-gray-700">Fecha Ingreso</TableHead>
                <TableHead className="font-semibold text-gray-700">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">
                    {patient.paciente.nombre} {patient.paciente.apellido}
                  </TableCell>
                  <TableCell className="text-gray-600">{patient.paciente.DNI}</TableCell>
                  <TableCell className="text-gray-600">{patient.paciente.edad} años</TableCell>
                  <TableCell className="text-gray-600">{patient.sector?.nombre}</TableCell>
                  <TableCell className="text-gray-600">
                    {patient.cama?.identificador ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {patient.cama.identificador}
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        Sin asignar
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600">
                    {patient.razon_ingreso}
                  </TableCell>
                  <TableCell className="text-gray-600">{formatDate(patient.fecha_ingreso)}</TableCell>
                  <TableCell>{getStatusBadge(patient)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {patients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay pacientes internados actualmente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
