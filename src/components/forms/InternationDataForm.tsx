
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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

interface InternationDataFormProps {
  data: InternationData;
  onSubmit: (data: InternationData) => void;
  isSubmitting: boolean;
}

interface Sector {
  id: string;
  nombre: string;
}

export function InternationDataForm({ data, onSubmit, isSubmitting }: InternationDataFormProps) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<InternationData>({
    defaultValues: data
  });

  useEffect(() => {
    const fetchSectors = async () => {
      const { data: sectorsData } = await supabase
        .from('sector')
        .select('id, nombre')
        .order('nombre');
      
      if (sectorsData) {
        setSectors(sectorsData);
      }
    };

    fetchSectors();
  }, []);

  const handleFormSubmit = (formData: InternationData) => {
    onSubmit(formData);
  };

  const checkboxFields = [
    { key: 'internacion_urgente' as keyof InternationData, label: 'Internación Urgente' },
    { key: 'inmunocomprometido' as keyof InternationData, label: 'Inmunocomprometido' },
    { key: 'oncologico' as keyof InternationData, label: 'Oncológico' },
    { key: 'leucemia' as keyof InternationData, label: 'Leucemia' },
    { key: 'internado_ultimos_30_dias' as keyof InternationData, label: 'Internado últimos 30 días' },
    { key: 'grave' as keyof InternationData, label: 'Estado Grave' },
    { key: 'fin_de_vida' as keyof InternationData, label: 'Fin de Vida' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de Internación</CardTitle>
        <CardDescription>
          Complete la información clínica y administrativa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="razon_ingreso">Razón de Ingreso *</Label>
              <Input
                id="razon_ingreso"
                {...register('razon_ingreso', { required: 'La razón de ingreso es obligatoria' })}
                placeholder="Describe el motivo de la internación"
              />
              {errors.razon_ingreso && (
                <p className="text-sm text-red-500">{errors.razon_ingreso.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector_id">Sector *</Label>
              <Select onValueChange={(value) => setValue('sector_id', value)} defaultValue={data.sector_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Condiciones Médicas</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checkboxFields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={watch(field.key) as boolean}
                      onCheckedChange={(checked: boolean) => setValue(field.key, checked)}
                    />
                    <Label htmlFor={field.key} className="text-sm">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => window.location.reload()}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Internar Paciente'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
