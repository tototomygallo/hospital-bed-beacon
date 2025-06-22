import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Zap,
  TrendingUp,
  Bed,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface PatientRecommendation {
  id: string;
  puntaje: number;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    DNI: string;
  };
  cama: {
    id: string;
    identificador: string;
    sector: {
      nombre: string;
    };
  } | null;
  internacion: {
    razon_ingreso: string;
    grave: boolean;
    fin_de_vida: boolean;
    internacion_urgente: boolean;
  };
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<PatientRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // ✅ Traer recomendaciones generadas por la IA
      const { data, error } = await supabase
        .from('Prioridades_internacion')
        .select(`
          id,
          puntaje,
          paciente:paciente_id (
            id,
            nombre,
            apellido,
            DNI
          ),
          cama_id
        `)
        .order('puntaje', { ascending: false });
      
      console.log('Prioridades_internacion raw data:', data, error);

      if (error) throw error;

      // ✅ Enriquecer y filtrar solo pacientes sin cama REAL
      const enrichedData = await Promise.all(
        (data || []).map(async (rec) => {
          if (!rec.paciente) return null;

          const { data: internacionData } = await supabase
            .from('internacion')
            .select('id_cama, razon_ingreso, grave, fin_de_vida, internacion_urgente')
            .eq('id_paciente', rec.paciente.id)
            .is('fecha_alta', null)
            .single();

          // ⛔️ Omitir si ya tiene cama asignada en internación real
          if (internacionData?.id_cama) return null;

          // ✅ Traer cama sugerida por IA
          let cama = null;
          if (rec.cama_id) {
            const { data: camaData } = await supabase
              .from('cama')
              .select('id, identificador, sector: id_sector ( nombre )')
              .eq('id', rec.cama_id)
              .single();
            cama = camaData || null;
          }

          return {
            id: rec.id.toString(),
            puntaje: rec.puntaje || 0,
            paciente: rec.paciente,
            cama,
            internacion: internacionData || {
              razon_ingreso: '',
              grave: false,
              fin_de_vida: false,
              internacion_urgente: false
            }
          };
        })
      );

      const validRecommendations = enrichedData.filter((rec) => rec !== null) as PatientRecommendation[];
      setRecommendations(validRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las recomendaciones.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

const executeAI = async () => {
  setCalculating(true);
  try {
    const response = await fetch('https://49f5-34-125-124-193.ngrok-free.app/ejecutar-ia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parametro1: "iniciar" }) // este valor puede ser lo que quieras enviar
    });

    if (!response.ok) throw new Error('Error en la respuesta de la IA');

    toast({
      title: 'IA ejecutada',
      description: 'Esperando resultados...'
    });

    // Esperar unos segundos y refrescar recomendaciones
    setTimeout(() => {
      loadRecommendations();
    }, 4000);

  } catch (error) {
    console.error('Error executing IA:', error);
    toast({
      title: 'Error',
      description: 'No se pudo conectar con la IA.',
      variant: 'destructive'
    });
  } finally {
    setCalculating(false);
  }
};

  const assignBed = async (patientId: string, bedId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('internacion')
        .update({ id_cama: bedId })
        .eq('id_paciente', patientId)
        .is('fecha_alta', null);

      if (updateError) throw updateError;

      const { error: bedError } = await supabase
        .from('cama')
        .update({ estado: 'ocupada' })
        .eq('id', bedId);

      if (bedError) throw bedError;

      toast({
        title: 'Cama asignada',
        description: 'La cama ha sido asignada exitosamente al paciente'
      });

      await loadRecommendations();
    } catch (error) {
      console.error('Error assigning bed:', error);
      toast({
        title: 'Error',
        description: 'No se pudo asignar la cama',
        variant: 'destructive'
      });
    }
  };

  const getPriorityBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          Crítico
        </Badge>
      );
    if (score >= 60)
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 gap-1">
          <TrendingUp className="w-3 h-3" />
          Alto
        </Badge>
      );
    if (score >= 40)
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 gap-1">
          <Clock className="w-3 h-3" />
          Medio
        </Badge>
      );
    return (
      <Badge variant="secondary" className="gap-1">
        Bajo
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <div>
              <CardTitle className="text-purple-900">AI Recommendations</CardTitle>
              <CardDescription className="text-purple-700">
                Sugerencias inteligentes para asignación de camas basadas en prioridad médica
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={executeAI}
            disabled={calculating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg gap-2"
          >
            {calculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Calculando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Ejecutar IA
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-purple-300 mx-auto mb-4 animate-pulse" />
            <p className="text-purple-600">Cargando recomendaciones...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Paciente</TableHead>
                  <TableHead className="font-semibold text-gray-700">DNI</TableHead>
                  <TableHead className="font-semibold text-gray-700">Puntaje</TableHead>
                  <TableHead className="font-semibold text-gray-700">Prioridad</TableHead>
                  <TableHead className="font-semibold text-gray-700">Razón</TableHead>
                  <TableHead className="font-semibold text-gray-700">Cama Sugerida</TableHead>
                  <TableHead className="font-semibold text-gray-700">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations.map((rec) => (
                  <TableRow key={rec.id} className="hover:bg-purple-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      {rec.paciente?.nombre} {rec.paciente?.apellido}
                    </TableCell>
                    <TableCell className="text-gray-600">{rec.paciente?.DNI}</TableCell>
                    <TableCell className="font-bold text-purple-600 text-lg">{rec.puntaje}</TableCell>
                    <TableCell>{getPriorityBadge(rec.puntaje)}</TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600">
                      {rec.internacion?.razon_ingreso}
                    </TableCell>
                    <TableCell>
                      {rec.cama?.identificador ? (
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-blue-600" />
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {rec.cama.identificador} - {rec.cama.sector?.nombre}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Sin asignar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {rec.cama && (
                        <Button
                          size="sm"
                          onClick={() => assignBed(rec.paciente.id, rec.cama!.id)}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        >
                          Asignar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {recommendations.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <p className="text-purple-600 text-lg mb-2">No hay recomendaciones disponibles</p>
                <p className="text-gray-500">Ejecuta la IA para generar sugerencias</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
